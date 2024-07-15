import { update } from '@/utils/actions';
import { analyzeEntry } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const { content } = await request.json();
    const user = await getUserByClerkId();
    const updatedEntry = await prisma.journalEntry.update({
      where: {
        userId_id: {
          userId: user.id,
          id: params.id,
        },
      },
      data: {
        content,
      },
    });

    const analysis = await analyzeEntry(updatedEntry.content);

    const updated = await prisma.analysis.upsert({
      where: {
        entryId: updatedEntry.id,
      },
      create: {
        userId: user.id,
        entryId: updatedEntry.id,
        ...analysis,
      },
      update: analysis,
    });

    return NextResponse.json({ data: { ...updatedEntry, analysis: updated } });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};

export const DELETE = async (_request: Request, { params }: { params: { id: string } }) => {
  try {
    const user = await getUserByClerkId();

    await prisma.journalEntry.delete({
      where: {
        userId_id: {
          id: params.id,
          userId: user.id,
        },
      },
    });

    update(['/journal']);

    return NextResponse.json({ data: { id: params.id } });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};
