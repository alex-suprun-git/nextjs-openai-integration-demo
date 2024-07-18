import { prisma } from '@/utils/db';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'New User Creation | OpenAI Daily Journal',
};

const createNewUser = async () => {
  const user = await currentUser();
  const match = await prisma.user.findUnique({ where: { clerkId: user?.id as string } });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
      },
    });
  }

  if (user) {
    redirect('/journal');
  }
};

const NewUserPage = async () => {
  await createNewUser();
  return <></>;
};

export default NewUserPage;
