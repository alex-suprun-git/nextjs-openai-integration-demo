import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful-management';
import { createHmac } from 'crypto';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || '';
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const WEBHOOK_SIGNING_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

const TAGS_LIST = ['webhookTriggered'];

/**
 * Verify Contentful webhook request signature
 * Based on: https://www.contentful.com/developers/docs/webhooks/request-verification/
 */
function verifyWebhookSignature(
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

  const requestTime = Number(timestamp);
  const currentTime = Date.now();
  const ttl = 30 * 1000;

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

  // Create HMAC-SHA256 signature (hexadecimal)
  const expectedSignature = createHmac('sha256', signingSecret)
    .update(canonicalRequest)
    .digest('hex');

  return signature === expectedSignature;
}

/**
 * Initialize Contentful CMA client
 */
function getContentfulClient() {
  if (!SPACE_ID || !MANAGEMENT_TOKEN) {
    throw new Error('Missing Contentful credentials');
  }

  return createClient({
    accessToken: MANAGEMENT_TOKEN,
  });
}

/**
 * Add tags to an entry
 */
async function addTagsToEntry(entryId: string, tags: string[]) {
  try {
    const client = getContentfulClient();
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    const entry = await environment.getEntry(entryId);

    if (entry && entry.metadata) {
      entry.metadata = entry.metadata || {};
      entry.metadata.tags = (entry.metadata.tags || []).concat(
        tags.map((tag) => ({ sys: { type: 'Link', linkType: 'Tag', id: tag } })),
      );

      const updated = await entry.update();

      return updated;
    }
  } catch (error) {
    console.error('Error adding tags:', error);
    throw error;
  }
}

/**
 * Handle Entry.publish webhook
 */
async function handleEntryPublish(payload: any) {
  const entryId = payload.sys?.id;

  try {
    await addTagsToEntry(entryId, TAGS_LIST);
    console.log(`✓ Successfully processed entry ${entryId}`);
  } catch (error) {
    console.error(`Failed to process entry ${entryId}:`, error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const topic = request.headers.get('x-contentful-topic');
    const url = new URL(request.url);

    // Verify webhook signature
    if (WEBHOOK_SIGNING_SECRET) {
      const canonicalRequest = {
        method: request.method,
        path: url.pathname + (url.search ? url.search : ''),
        headers: {
          'x-contentful-signed-headers': request.headers.get('x-contentful-signed-headers') || '',
          'x-contentful-timestamp': request.headers.get('x-contentful-timestamp') || '',
          'x-contentful-topic': topic || '',
          'content-type': request.headers.get('content-type') || '',
        },
        body,
      };

      const isValid = verifyWebhookSignature(canonicalRequest, WEBHOOK_SIGNING_SECRET);

      if (!isValid) {
        console.error('❌ Invalid webhook signature');
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 403 });
      }

      console.log('✓ Webhook signature verified');
    } else {
      console.warn('⚠️ Webhook signing secret not configured');
    }

    const payload = JSON.parse(body);

    // Route to appropriate handler
    if (topic === 'ContentManagement.Entry.publish') {
      await handleEntryPublish(payload);
    } else {
      console.log(`⚠️ Unhandled topic: ${topic}`);
    }

    return NextResponse.json(
      { success: true, message: 'Webhook processed', topic },
      { status: 200 },
    );
  } catch (error) {
    console.error('Webhook error:', error);
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
    security: 'enabled',
  });
}
