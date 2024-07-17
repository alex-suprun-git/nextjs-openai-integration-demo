import { NextResponse } from 'next/server';
import { update } from '@/utils/actions';
import { analyzeEntry } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
  const { content } = await request.json();
  const user = await getUserByClerkId();

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 });
  }

  try {
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
    if (isDynamicServerError(error)) {
      throw error;
    }

    console.error('Error processing PATCH request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};

export const DELETE = async (_request: Request, { params }: { params: { id: string } }) => {
  const user = await getUserByClerkId();

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 });
  }

  try {
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
    if (isDynamicServerError(error)) {
      throw error;
    }

    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};
