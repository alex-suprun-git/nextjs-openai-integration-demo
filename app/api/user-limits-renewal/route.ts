import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

const CRON_SECRET = process.env.VERCEL_CRON_SECRET;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const usersToUpdate = await prisma.user.findMany({
      where: {
        promptSymbolsLimitRenewal: {
          lte: now,
        },
      },
    });

    if (usersToUpdate.length === 0) {
      return NextResponse.json({ message: 'No users found for update.' });
    }

    for (const user of usersToUpdate) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          promptSymbolsUsed: 0,
          promptSymbolsLimitRenewal: new Date(
            user.promptSymbolsLimitRenewal.setMonth(user.promptSymbolsLimitRenewal.getMonth() + 1),
          ),
        },
      });
    }

    return NextResponse.json({ message: 'Prompt symbols used reset for applicable users.' });
  } catch (error) {
    console.error('Error resetting prompt symbols used:', error);
    return NextResponse.json({ message: 'Failed to reset prompt symbols used.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
