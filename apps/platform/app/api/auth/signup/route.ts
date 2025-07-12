import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { hash } from 'bcryptjs';

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password too short' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'User exists' }, { status: 400 });
    }

    const hashed = await hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
        promptSymbolsLimitRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        promptSymbolsLimit: 2500,
      },
    });

    return NextResponse.json({ message: 'User created' });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};
