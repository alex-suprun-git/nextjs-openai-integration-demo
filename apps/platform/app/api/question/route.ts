import { analysisFeedback } from '@/utils/ai';
import { getCurrentUser } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';
import { getLocale } from 'next-intl/server';

export const POST = async (request: Request) => {
  const language = await getLocale();
  const { question } = await request.json();
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 });
  }

  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    const answer = await analysisFeedback(language as UserLocale, question, entries);

    return NextResponse.json({ data: answer });
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }

    console.error('Error processing POST request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};
