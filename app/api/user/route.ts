import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

export const PATCH = async (request: Request) => {
  const { promptSymbolsUsed } = await request.json();

  const user = await getUserByClerkId();

  await prisma.user.update({
    where: { id: user.id },
    data: { promptSymbolsUsed },
  });

  return NextResponse.json({ message: 'User updated successfully' });
};
