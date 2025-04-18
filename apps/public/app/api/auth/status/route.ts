import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const publicKey = process.env.CLERK_PUBLISHABLE_KEY;

  const token =
    cookieStore.get('__session')?.value || request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ isSignedIn: false }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, publicKey!, {
      algorithms: ['RS256'],
    });

    return NextResponse.json({ isSignedIn: true, userId: decoded.sub });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ isSignedIn: false }, { status: 200 });
  }
}
