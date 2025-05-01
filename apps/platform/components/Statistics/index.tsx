'use client';

import { useTranslations } from 'next-intl';
import { Breadcrumbs, BreadcrumbsItem, Heading } from '@repo/global-ui';
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
  const h = useTranslations('Header');

  if (analyses.length <= 1) {
    return (
      <div data-testid="statisticsPage" className="p-10">
        <p className="text-xl">{t('labels.noEntries')}</p>
      </div>
    );
  }

  return (
    <div data-testid="statisticsPage" className="container mx-auto p-10 pb-32">
      <Breadcrumbs>
        <BreadcrumbsItem href="/">{h('navigation.journal')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('headline')}</BreadcrumbsItem>
      </Breadcrumbs>

      <Heading>{t('headline')}</Heading>
      <p className="mb-20 max-w-screen-sm text-lg leading-relaxed">{t('description')}</p>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SentimentOverTimeChart data={analyses as AnalysisEntry[]} />
        <MoodDistribution data={analyses as AnalysisEntry[]} />
        <PositiveNegativeRatio data={analyses as AnalysisEntry[]} />
      </div>
    </div>
  );
}

export default StatisticsData;
