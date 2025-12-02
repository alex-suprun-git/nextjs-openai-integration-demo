import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const topic = request.headers.get('x-contentful-topic');
    const payload = JSON.parse(body);

    console.log('✓ Webhook received!');
    console.log('Topic:', topic);
    console.log('Entry ID:', payload.sys?.id);
    console.log('Content Type:', payload.sys?.contentType?.sys?.id);

    // TODO: Add verification later once request verification is enabled

    return NextResponse.json(
      { success: true, message: 'Webhook processed', topic },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
  }
}
