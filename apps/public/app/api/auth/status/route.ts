import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('__client_uat')?.value;
  const isSignedIn = cookie !== undefined && cookie !== '0' && cookie !== '';

  if (isSignedIn) {
    return NextResponse.json({ isSignedIn: true }, { status: 200 });
  } else {
    return NextResponse.json({ isSignedIn: false }, { status: 200 });
  }
}
