'use client';

import { useTranslations } from 'next-intl';

function PositiveNegativeRatio({ data }: { data: AnalysisEntry[] }) {
  const t = useTranslations('StatisticsPage');

  return (
    <div className="h-full w-full">
      <h2 className="mb-4 text-xl font-medium text-stone-200">
        {t('charts.positiveNegativeRatio')}
      </h2>
    </div>
  );
}

export default PositiveNegativeRatio;
