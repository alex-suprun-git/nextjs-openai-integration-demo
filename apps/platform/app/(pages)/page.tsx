import { redirect } from 'next/navigation';
import JournalList from '@/components/JournalList';
import { getCurrentUser } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getEntries = async () => {
  const user = await getCurrentUser();
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
    <div className="min-h-svh">
      <JournalList entries={entries as Required<AnalysisSubEntry[]> | []} />
    </div>
  );
};

export default JournalPage;
