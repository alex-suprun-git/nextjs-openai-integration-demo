import { NextResponse } from 'next/server';
import { update } from '@/utils/actions';
import { getCurrentUser } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const user = await getCurrentUser();
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
