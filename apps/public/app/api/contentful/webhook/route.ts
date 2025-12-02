import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// Add your Contentful webhook signing secret to environment variables
const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

/**
 * Verifies the webhook signature from Contentful
 */
function verifyWebhookSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) {
    return false;
  }

  // Create HMAC-SHA256 hash of the request body
  const expectedSignature = createHmac('sha256', secret).update(body).digest('base64');

  // Compare signatures (use timing-safe comparison)
  return signature === expectedSignature;
}

/**
 * Handle Entry publish events
 */
async function handleEntryPublish(payload: any, topic: string): Promise<void> {
  const { sys, fields } = payload;
  const entryId = sys?.id;
  const contentType = sys?.contentType?.sys?.id;

  console.log(`📝 Entry Published: ${entryId} (Type: ${contentType})`);
  console.log('Fields:', JSON.stringify(fields, null, 2));

  // Add your business logic here:
  // - Revalidate cache for this entry
  // - Trigger a build
  // - Send a notification
  // - Update your database
  // - Regenerate static pages

  // Dummy example: log specific content types
  if (contentType === 'page') {
    console.log('🔄 Page published - consider revalidating cache');
  } else if (contentType === 'homepageHeroBanner') {
    console.log('🎨 Hero banner updated - should revalidate homepage');
  }
}

/**
 * Handle Entry unpublish events
 */
async function handleEntryUnpublish(payload: any, topic: string): Promise<void> {
  const { sys } = payload;
  const entryId = sys?.id;

  console.log(`🗑️ Entry Unpublished: ${entryId}`);
}

/**
 * Handle Asset publish events
 */
async function handleAssetPublish(payload: any, topic: string): Promise<void> {
  const { sys, fields } = payload;
  const assetId = sys?.id;

  console.log(`🖼️ Asset Published: ${assetId}`);
  console.log('Asset Details:', JSON.stringify(fields, null, 2));
}

/**
 * Route webhook events to appropriate handlers
 */
async function handleWebhookEvent(topic: string, payload: any): Promise<void> {
  if (topic === 'ContentManagement.Entry.publish') {
    await handleEntryPublish(payload, topic);
  } else if (topic === 'ContentManagement.Entry.unpublish') {
    await handleEntryUnpublish(payload, topic);
  } else if (topic === 'ContentManagement.Asset.publish') {
    await handleAssetPublish(payload, topic);
  } else {
    console.log(`⚠️ Unhandled webhook topic: ${topic}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (important for signature verification)
    const body = await request.text();

    // Get webhook headers
    const signature = request.headers.get('x-contentful-webhook-signature');
    const topic = request.headers.get('x-contentful-topic');
    const webhookName = request.headers.get('x-contentful-webhook-name');

    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      const isValid = verifyWebhookSignature(body, signature, WEBHOOK_SECRET);

      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid signature',
          },
          { status: 401 },
        );
      }

      console.log('✓ Webhook signature verified');
    } else {
      console.warn('⚠️ Warning: CONTENTFUL_WEBHOOK_SECRET not configured');
    }

    // Parse the body after verification
    const payload = JSON.parse(body);

    // Log the webhook data
    console.log('=== Contentful Webhook Received ===');
    console.log('Topic:', topic);
    console.log('Webhook Name:', webhookName);

    // Route to appropriate handler
    if (topic) {
      await handleWebhookEvent(topic, payload);
    }

    // Return success response
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
      {
        success: false,
        error: 'Failed to process webhook',
      },
      { status: 500 },
    );
  }
}

// Optional: GET endpoint to verify webhook is working
export async function GET() {
  return NextResponse.json({
    message: 'Contentful Webhook Endpoint',
    description: 'This endpoint receives webhooks from Contentful',
    status: 'active',
    endpoint: 'POST /api/contentful/webhook',
    security: WEBHOOK_SECRET ? 'enabled' : 'disabled',
    handlers: [
      'ContentManagement.Entry.publish',
      'ContentManagement.Entry.unpublish',
      'ContentManagement.Asset.publish',
    ],
  });
}
