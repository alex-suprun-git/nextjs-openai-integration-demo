import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import JournalList from '@/components/JournalList';

export const metadata: Metadata = {
  title: 'Dashboard | OpenAI Daily Dashboard',
  description: 'Dashboard page for OpenAI Daily Dashboard',
};

const getEntries = async () => {
  const user = await getUserByClerkId();
  if (!user) {
    return { entries: [], user: null };
  }

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      analysis: true,
    },
  });

  return { entries, user };
};

const JournalPage = async () => {
  const { entries, user } = await getEntries();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-svh p-10">
      <JournalList entries={entries as Required<AnalysisSubEntry[]> | []} />
    </div>
  );
};

export default JournalPage;
