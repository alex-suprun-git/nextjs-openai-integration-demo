'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { FaRegQuestionCircle } from 'react-icons/fa';

type AnalysisEntry = {
  negative: boolean;
  color: string;
};

interface PositiveNegativeRatioProps {
  data: AnalysisEntry[];
}

const PositiveNegativeRatio = ({ data }: PositiveNegativeRatioProps) => {
  const t = useTranslations('StatisticsPage');

  // Aggregate positive vs negative counts
  const chartData = useMemo(() => {
    const counts = { positive: 0, negative: 0 };
    data.forEach(({ negative }) => {
      counts[negative ? 'negative' : 'positive'] += 1;
    });
    return [
      {
        name: t('charts.positiveNegativeRatio.labels.negative'),
        value: counts.negative,
        color: '#ff595e',
      },
      {
        name: t('charts.positiveNegativeRatio.labels.positive'),
        value: counts.positive,
        color: '#1982c4',
      },
    ];
  }, [data, t]);

  return (
    <div className="border-2 border-dashed border-gray-900 bg-slate-800 p-6 sm:p-12">
      <h2 className="mb-12 text-center text-xl font-medium text-stone-200">
        {t('charts.positiveNegativeRatio.title')}
        <sup className="tooltip ml-1" data-tip={t('charts.positiveNegativeRatio.description')}>
          <FaRegQuestionCircle fontSize={14} />
        </sup>
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip />
          <Legend verticalAlign="bottom" />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={4}
            label
            isAnimationActive={false}
          >
            {chartData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PositiveNegativeRatio;
