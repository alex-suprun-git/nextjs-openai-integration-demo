'use client';

import { Heading } from '@repo/ui/index';
import HistoryChart from './HistoryChart';
import { useTranslations } from 'next-intl';

function StatisticsData({
  analyses,
  averageSentiment,
}: {
  analyses: AnalysisEntryResponse[] | [];
  averageSentiment: number | null;
}) {
  const t = useTranslations('StatisticsPage');

  return (
    <div data-testid="statisticsPage" className="p-10">
      <Heading>{t('headline')}</Heading>
      {analyses.length === 0 ? (
        <p className="text-xl text-stone-300">{t('labels.noEntries')}</p>
      ) : (
        <>
          {!!averageSentiment && (
            <p className="mb-12 text-xl text-stone-300">
              {t('labels.averageSentiment', { averageSentiment })}
            </p>
          )}
          <HistoryChart data={analyses as AnalysisEntry[]} />
        </>
      )}
    </div>
  );
}

export default StatisticsData;
