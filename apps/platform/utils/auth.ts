import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { prisma } from './db';
import { Prisma } from '@prisma/client';
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context';

export const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.warn('User email is not available. User might be signed out.');
      return null;
    }

    const user = await prisma.user.findFirstOrThrow({
      where: {
        email: session.user.email as string,
      },
    });

    return user;
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Prisma validation error:', error.message);
      throw new Error('Failed to find user due to validation error.');
    } else if (error.code === 'P2025') {
      console.error('User not found:', error.message);
      throw new Error('User not found.');
    } else {
      if (isDynamicServerError(error)) {
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
};
