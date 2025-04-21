'use client';

import { useTranslations } from 'next-intl';

function MoodDistribution({ data }: { data: AnalysisEntry[] }) {
  const t = useTranslations('StatisticsPage');

  return (
    <div className="h-full w-full">
      <h2 className="mb-4 text-xl font-medium text-stone-200">{t('charts.moodDistribution')}</h2>
    </div>
  );
}

export default MoodDistribution;
