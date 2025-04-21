'use client';

import { useTranslations } from 'next-intl';
import { Heading } from '@repo/global-ui/index';
import SentimentOverTimeChart from './charts/SentimentOverTime';
import MoodDistribution from './charts/MoodDistribution';
import PositiveNegativeRatio from './charts/PositiveNegativeRatio';

function StatisticsData({
  analyses,
}: {
  analyses: AnalysisEntryResponse[] | [];
  averageSentiment?: number | null;
}) {
  const t = useTranslations('StatisticsPage');

  if (analyses.length <= 1) {
    return (
      <div data-testid="statisticsPage" className="p-10">
        <p className="text-xl text-stone-300">{t('labels.noEntries')}</p>
      </div>
    );
  }

  return (
    <div data-testid="statisticsPage" className="p-10">
      <Heading>{t('headline')}</Heading>
      <p className="mb-20 max-w-screen-sm text-lg leading-relaxed text-stone-200">
        {t('description')}
      </p>
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-32">
        <SentimentOverTimeChart data={analyses as AnalysisEntry[]} />
        <MoodDistribution data={analyses as AnalysisEntry[]} />
        <PositiveNegativeRatio data={analyses as AnalysisEntry[]} />
      </div>
    </div>
  );
}

export default StatisticsData;
