import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get webhook headers
    const headers = {
      topic: request.headers.get('x-contentful-topic'),
      webhookName: request.headers.get('x-contentful-webhook-name'),
      contentType: request.headers.get('content-type'),
    };

    // Get the webhook payload
    const payload = await request.json();

    // Log the webhook data (for POC purposes)
    console.log('=== Contentful Webhook Received ===');
    console.log('Headers:', JSON.stringify(headers, null, 2));
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
        message: 'Webhook received successfully',
        topic: headers.topic,
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
  });
}
