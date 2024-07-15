import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import EntryCard from '@/components/EntryCard';
import NewEntryCard from '@/components/NewEntryCard';
import Question from '@/components/Question';
import { Heading } from '@/ui-lib';

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
    redirect('/');
    return null; // Added return to avoid further rendering
  }

  return (
    <div className="min-h-svh bg-zinc-300/10 p-10">
      <Heading>Journal</Heading>
      {!!entries.length && <Question />}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
        <NewEntryCard />
        {entries.map((entry) => {
          const analysisEntry = entry as Required<AnalysisSubEntry>;
          return (
            <Link key={analysisEntry.id} href={`/journal/${analysisEntry.id}`}>
              <EntryCard
                id={analysisEntry.id}
                createdAt={analysisEntry.createdAt}
                updatedAt={analysisEntry.updatedAt}
                content={analysisEntry.content}
                color={analysisEntry.analysis.color}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default JournalPage;
