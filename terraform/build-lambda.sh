#!/bin/bash
set -euo pipefail

echo "🚀 Building Lambda Package for Next.js (standalone)"
echo "=================================================="

TERRAFORM_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$TERRAFORM_DIR/.." && pwd)"

APP_DIR="$PROJECT_ROOT/apps/public"
BUILD_DIR="$APP_DIR/.next"
STANDALONE_DIR="$BUILD_DIR/standalone"
STANDALONE_APP_DIR="$STANDALONE_DIR/apps/public"

LAMBDA_DIR="$TERRAFORM_DIR/lambda-nextjs-public"
ZIP_FILE="$TERRAFORM_DIR/lambda-nextjs-public.zip"

echo "1️⃣ Cleaning..."
rm -rf "$LAMBDA_DIR" "$ZIP_FILE"
mkdir -p "$LAMBDA_DIR"

if [ ! -f "$STANDALONE_APP_DIR/server.js" ]; then
  echo "❌ Error: Next standalone server.js not found at: $STANDALONE_APP_DIR/server.js"
  echo "   Run: yarn workspace public build"
  exit 1
fi

if [ ! -d "$STANDALONE_DIR/node_modules" ]; then
  echo "❌ Error: Standalone node_modules not found at: $STANDALONE_DIR/node_modules"
  echo "   Your build output is incomplete; re-run the Next build."
  exit 1
fi

echo "2️⃣ Copying standalone entry files..."
cp "$STANDALONE_APP_DIR/server.js" "$LAMBDA_DIR/server.js"
cp "$STANDALONE_APP_DIR/package.json" "$LAMBDA_DIR/package.json"

echo "3️⃣ Copying standalone-traced node_modules..."
cp -R "$STANDALONE_DIR/node_modules" "$LAMBDA_DIR/node_modules"

echo "4️⃣ Copying required .next server files..."
mkdir -p "$LAMBDA_DIR/.next"

if [ ! -d "$BUILD_DIR/server" ]; then
  echo "❌ Error: Build server output not found at: $BUILD_DIR/server"
  exit 1
fi

# Static assets (so API Gateway URL can serve /_next/static/* too)
if [ -d "$BUILD_DIR/static" ]; then
  cp -R "$BUILD_DIR/static" "$LAMBDA_DIR/.next/static"
fi

# Ensure Next's compiled output stays CommonJS where required.
# Next writes `.next/package.json` with `{ "type": "commonjs" }` so that `.next/server/*.js`
# (including `instrumentation.js`) can use `require(...)` even if the app itself is ESM.
if [ -f "$BUILD_DIR/package.json" ]; then
  cp "$BUILD_DIR/package.json" "$LAMBDA_DIR/.next/package.json"
fi

# Server runtime output (compiled app router / chunks)
cp -R "$BUILD_DIR/server" "$LAMBDA_DIR/.next/server"

# Required manifests (Next lists a minimal set here; we still copy full .next/server above)
REQUIRED_FILES_JSON="$BUILD_DIR/required-server-files.json"
if [ ! -f "$REQUIRED_FILES_JSON" ]; then
  echo "❌ Error: required-server-files.json not found at: $REQUIRED_FILES_JSON"
  exit 1
fi

# Copy the required-server-files.json itself (Next.js needs it at runtime)
cp "$REQUIRED_FILES_JSON" "$LAMBDA_DIR/.next/required-server-files.json"

node -e "const r=require(process.argv[1]); process.stdout.write(r.files.join('\n'))" "$REQUIRED_FILES_JSON" | while IFS= read -r rel; do
  [ -z "$rel" ] && continue
  src="$APP_DIR/$rel"
  dst="$LAMBDA_DIR/$rel"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
done

echo "5️⃣ Copying public/ (so /manifest.json, /sw.js etc work)..."
if [ -d "$APP_DIR/public" ]; then
  cp -R "$APP_DIR/public" "$LAMBDA_DIR/public"
fi

echo "6️⃣ Writing Lambda handler (ESM)..."
cat > "$LAMBDA_DIR/handler.js" << 'HANDLER'
import http from 'node:http';
import { spawn } from 'node:child_process';

const SERVER_PORT = 3000;
let serverProcess = null;
let serverReady = false;

async function startNextServer() {
  if (serverProcess) return;

  return await new Promise((resolve, reject) => {
    console.log('Starting Next.js...');

    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: String(SERVER_PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Next.js:', output);
      if (output.includes('Ready') || output.includes('started server')) {
        serverReady = true;
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error('Next.js Error:', data.toString());
    });

    serverProcess.on('error', reject);

    // Fallback: don't block forever on "Ready" log.
    setTimeout(() => {
      serverReady = true;
      resolve();
    }, 10000);
  });
}

function shouldBase64Encode(contentType) {
  if (!contentType) return false;
  const ct = String(contentType).toLowerCase();

  // Treat common textual types as UTF-8; everything else as binary.
  if (ct.startsWith('text/')) return false;
  if (
    ct.includes('application/json') ||
    ct.includes('application/javascript') ||
    ct.includes('application/x-javascript') ||
    ct.includes('application/xml') ||
    ct.includes('application/xhtml+xml') ||
    ct.includes('application/manifest+json') ||
    ct.includes('image/svg+xml')
  ) {
    return false;
  }

  return true;
}

function proxyRequest(path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: SERVER_PORT,
        path,
        method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 502,
            headers: res.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export const handler = async (event) => {
  try {
    if (!serverReady) await startNextServer();

    const rawPath = event.rawPath || event.path || '/';
    const rawQueryString = event.rawQueryString || '';
    const path = rawQueryString ? `${rawPath}?${rawQueryString}` : rawPath;
    const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

    const headers = {};
    if (event.headers) {
      for (const [key, value] of Object.entries(event.headers)) {
        if (typeof value === 'undefined') continue;
        headers[key.toLowerCase()] = value;
      }
    }

    const response = await proxyRequest(path, method, headers, event.body);

    const cleanHeaders = {};
    const cookies = [];
    const badHeaders = new Set(['transfer-encoding', 'connection', 'keep-alive', 'upgrade', 'trailer', 'te']);

    for (const [key, value] of Object.entries(response.headers ?? {})) {
      const lower = key.toLowerCase();
      if (badHeaders.has(lower)) continue;

      if (lower === 'set-cookie') {
        if (Array.isArray(value)) cookies.push(...value);
        else if (typeof value !== 'undefined') cookies.push(value);
        continue;
      }

      // API Gateway is case-insensitive, but CloudFront logs look cleaner with normal casing.
      const normalized = key
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('-');

      cleanHeaders[normalized] = value;
    }

    const contentType = response.headers?.['content-type'] ?? response.headers?.['Content-Type'];
    const isBase64Encoded = shouldBase64Encode(contentType);

    // If we're base64-encoding, drop Content-Length (it's for the raw bytes).
    if (isBase64Encoded) {
      delete cleanHeaders['Content-Length'];
    }

    const result = {
      statusCode: response.statusCode,
      headers: cleanHeaders,
      body: isBase64Encoded ? response.body.toString('base64') : response.body.toString('utf8'),
      isBase64Encoded,
    };

    if (cookies.length > 0) result.cookies = cookies;
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
    };
  }
};
HANDLER

echo "7️⃣ Optimizing package..."
# Remove source maps and build-time caches (biggest win)
find "$LAMBDA_DIR" -name "*.map" -type f -delete
rm -rf "$LAMBDA_DIR/.next/cache" "$LAMBDA_DIR/.next/turbopack" "$LAMBDA_DIR/.next/dev" "$LAMBDA_DIR/.next/build"

echo "8️⃣ Creating ZIP..."
(cd "$LAMBDA_DIR" && zip -r "$ZIP_FILE" . -q -x "*.DS_Store")

SIZE="$(du -h "$ZIP_FILE" | cut -f1)"
BYTES="$(stat -f%z "$ZIP_FILE" 2>/dev/null || stat -c%s "$ZIP_FILE" 2>/dev/null || echo 0)"
MAX_BYTES=70167211

echo ""
echo "✅ Package created: $ZIP_FILE ($SIZE)"

if [ "$BYTES" -gt "$MAX_BYTES" ]; then
  echo "⚠️  ZIP is larger than the ~70MB Lambda direct upload limit."
  echo "   Next step: switch Terraform to deploy Lambda code via S3 (no 70MB limit)."
  exit 2
fi

echo ""
echo "🚀 Ready to deploy with: cd terraform && terraform apply"

