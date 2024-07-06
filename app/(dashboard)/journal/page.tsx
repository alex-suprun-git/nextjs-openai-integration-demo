import { getUserByClerkId } from '@/utils/auth';
import Link from 'next/link';
import EntryCard from '@/components/EntryCard';
import NewEntryCard from '@/components/NewEntryCard';
import { prisma } from '@/utils/db';
import Heading from '@/components/Heading';
import Question from '@/components/Question';

const getEntries = async () => {
  const user = await getUserByClerkId();
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

  return entries;
};

const JournalPage = async () => {
  const entries: AnalysisSubEntryResponse[] = await getEntries();

  if (!entries) {
    return null;
  }

  return (
    <div className="min-h-svh bg-zinc-300/10 p-10">
      <Heading>Journal</Heading>
      {!!entries.length && <Question />}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        <NewEntryCard />
        {entries.map((entry) => {
          const analysisEntry = entry as Required<AnalysisSubEntry>;
          return (
            <Link key={analysisEntry.id} href={`/journal/${analysisEntry.id}`}>
              <EntryCard
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
