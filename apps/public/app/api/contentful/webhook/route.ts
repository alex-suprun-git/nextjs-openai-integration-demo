import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

/**
 * Verifies Contentful webhook request signature
 * Based on: https://www.contentful.com/developers/docs/webhooks/request-verification/
 */
function verifyContentfulRequest(
  request: {
    method: string;
    path: string;
    headers: Record<string, string>;
    body: string;
  },
  signingSecret: string,
): boolean {
  const signature = request.headers['x-contentful-signature'];
  const signedHeaders = request.headers['x-contentful-signed-headers'];
  const timestamp = request.headers['x-contentful-timestamp'];

  if (!signature || !signedHeaders || !timestamp) {
    console.warn('Missing signature headers');
    return false;
  }

  // Check TTL (30 seconds by default, can adjust)
  const requestTime = Number(timestamp);
  const currentTime = Date.now();
  const ttl = 30 * 1000; // 30 seconds

  if (currentTime - requestTime > ttl) {
    console.warn('Request timestamp too old - potential replay attack');
    return false;
  }

  // Build canonical request representation
  const canonicalHeaders = signedHeaders
    .split(',')
    .map((headerName: string) => {
      const headerValue = request.headers[headerName.toLowerCase()] || '';
      return `${headerName.toLowerCase()}:${headerValue}`;
    })
    .join(';');

  const canonicalRequest = [request.method, request.path, canonicalHeaders, request.body].join(
    '\n',
  );

  // Create HMAC-SHA256 signature (hexadecimal, not base64!)
  const expectedSignature = createHmac('sha256', signingSecret)
    .update(canonicalRequest)
    .digest('hex');

  console.log('🔍 Signature verification:');
  console.log('   Received:', signature);
  console.log('   Expected:', expectedSignature);
  console.log('   Match:', signature === expectedSignature);

  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Webhook request received');

    const body = await request.text();
    const url = new URL(request.url);

    const canonicalRequest = {
      method: request.method,
      path: url.pathname + (url.search ? url.search : ''),
      headers: {
        'x-contentful-signed-headers': request.headers.get('x-contentful-signed-headers') || '',
        'x-contentful-timestamp': request.headers.get('x-contentful-timestamp') || '',
        'x-contentful-topic': request.headers.get('x-contentful-topic') || '',
        'content-type': request.headers.get('content-type') || '',
        // Add other headers as needed based on x-contentful-signed-headers
      },
      body,
    };

    if (WEBHOOK_SECRET) {
      const isValid = verifyContentfulRequest(canonicalRequest, WEBHOOK_SECRET);

      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 403 });
      }

      console.log('✓ Webhook signature verified');
    } else {
      console.warn('⚠️ CONTENTFUL_WEBHOOK_SECRET not configured');
    }

    const payload = JSON.parse(body);
    const topic = request.headers.get('x-contentful-topic');

    console.log('=== Contentful Webhook Received ===');
    console.log('Topic:', topic);
    console.log('Entry ID:', payload.sys?.id);

    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        topic,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Contentful Webhook Endpoint',
    status: 'active',
  });
}
