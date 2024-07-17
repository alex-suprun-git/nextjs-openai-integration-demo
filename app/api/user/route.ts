import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';

export const PATCH = async (request: Request) => {
  const { promptSymbolsUsed } = await request.json();
  const user = await getUserByClerkId();

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { promptSymbolsUsed },
    });

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error;
    }

    console.error('Error processing PATCH request:', error);
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
};
