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
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Here you can add your business logic based on the webhook type
    // For example:
    // - Revalidate cache
    // - Trigger builds
    // - Send notifications
    // - Update database

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook received and verified successfully',
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
  });
}
