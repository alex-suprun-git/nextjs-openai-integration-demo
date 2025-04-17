'use client';

import { Heading } from '@/ui-lib';
import Link from 'next/link';
import EntryCard from '../EntryCard';
import NewEntryCard from '../NewEntryCard';
import Question from '../Question';
import { useTranslations } from 'next-intl';

const JournalList = ({ entries }: { entries: Required<AnalysisSubEntry[]> | [] }) => {
  const t = useTranslations('JournalList');

  return (
    <>
      <Heading>{t('headline')}</Heading>
      {!!entries?.length && <Question />}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        <NewEntryCard />
        {entries?.map((entry) => {
          const analysisEntry = entry as Required<AnalysisSubEntry>;
          return (
            <Link key={analysisEntry.id} href={`/${analysisEntry.id}`}>
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
    </>
  );
};

export default JournalList;
