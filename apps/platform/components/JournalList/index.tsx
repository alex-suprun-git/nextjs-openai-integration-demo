'use client';

import Link from 'next/link';
import EntryCard from '../EntryCard';
import NewEntryCard from '../NewEntryCard';
import Question from '../Question';
import { ENTRIES_BASE_PATH } from '@/utils/constants';

const JournalList = ({ entries }: { entries: Required<AnalysisSubEntry[]> | [] }) => {
  return (
    <div className="container mx-auto px-6 py-10 xl:px-10">
      {!!entries?.length && <Question />}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <NewEntryCard />
        {entries?.map((entry) => {
          const analysisEntry = entry as Required<AnalysisSubEntry>;
          return (
            <Link key={analysisEntry.id} href={`${ENTRIES_BASE_PATH}/${analysisEntry.id}`}>
              <EntryCard
                id={analysisEntry.id}
                createdAt={analysisEntry.createdAt}
                title={analysisEntry.analysis?.title}
                color={analysisEntry.analysis?.color}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default JournalList;
