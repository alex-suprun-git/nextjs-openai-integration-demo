import { getUserByClerkId } from '@/utils/auth';
import Link from 'next/link';
import EntryCard from '@/components/EntryCard';
import NewEntryCard from '@/components/NewEntryCard';
import { prisma } from '@/utils/db';
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
  });

  return entries;
};

const JournalPage = async () => {
  const entries = await getEntries();
  return (
    <div className="p-10 bg-zinc-300/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      {!!entries.length && (
        <div className="my-10">
          <Question />
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default JournalPage;
