'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { useWindowWidth, getChartAspectRatio } from '@/hooks/useWindowWidth';

type AnalysisEntry = {
  negative: boolean;
  color: string;
};

interface PositiveNegativeRatioProps {
  data: AnalysisEntry[];
}

const PositiveNegativeRatio = ({ data }: PositiveNegativeRatioProps) => {
  const t = useTranslations('StatisticsPage');
  const windowWidth = useWindowWidth();

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
    <div className="border-2 border-dashed border-gray-900 bg-slate-800 p-6">
      <h2 className="mb-12 text-center text-xl font-medium">
        {t('charts.positiveNegativeRatio.title')}
        <sup className="tooltip ml-1" data-tip={t('charts.positiveNegativeRatio.description')}>
          <FaRegQuestionCircle fontSize={14} />
        </sup>
      </h2>
      <ResponsiveContainer aspect={getChartAspectRatio(windowWidth)}>
        <PieChart
          margin={{
            top: 5,
            right: 5,
            left: windowWidth < 576 ? 5 : 10,
            bottom: 5,
          }}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.95)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          />
          <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: windowWidth < 576 ? 14 : 16 }} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={windowWidth < 576 ? '50%' : '60%'}
            outerRadius={windowWidth < 576 ? '70%' : '80%'}
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
