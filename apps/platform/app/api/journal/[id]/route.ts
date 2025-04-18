import { NextResponse } from 'next/server';
import { update } from '@/utils/actions';
import { analyzeEntry } from '@/utils/ai';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';

/* @deprecated
 * Reason: editing of existing records has been disabled
 */
export const PATCH = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
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
          id,
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

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await getUserByClerkId();
  const { id } = await params;

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 });
  }

  try {
    await prisma.journalEntry.delete({
      where: {
        userId_id: {
          id,
          userId: user.id,
        },
      },
    });

    await update(['/']);

    return NextResponse.json({ data: { id } });
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }

    console.error('Error processing DELETE request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};
