import { FC } from 'react';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

import EntryCard from '@/components/EntryCard';
import NewEntryCard from '@/components/NewEntryCard';

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

const JournalPage: FC = async () => {
  const entries = await getEntries();
  return (
    <div className="p-10 bg-zinc-300/10 h-full">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="grid grid-cols-4 gap-4">
        <NewEntryCard />
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};
export default JournalPage;
