import { NextResponse } from 'next/server';
import { update } from '@/utils/actions';
import { analyzeEntry } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

export const POST = async (request: Request) => {
  const { content } = await request.json();

  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content,
    },
  });

  const analysis = await analyzeEntry(entry.content);
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      ...analysis,
    },
  });

  update(['/journal']);

  return NextResponse.json({ data: entry });
};
