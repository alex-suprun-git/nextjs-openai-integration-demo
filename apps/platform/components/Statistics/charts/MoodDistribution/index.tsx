'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { FaRegQuestionCircle } from 'react-icons/fa';

type AnalysisEntry = {
  mood: string;
  color: string;
};

interface MoodDistributionProps {
  data: AnalysisEntry[];
}

const MoodDistribution = ({ data }: MoodDistributionProps) => {
  const t = useTranslations('StatisticsPage');

  // Aggregate counts by mood
  const chartData = useMemo(() => {
    const counts: Record<string, { mood: string; count: number; color: string }> = {};
    data.forEach(({ mood, color }) => {
      if (!counts[mood]) counts[mood] = { mood, count: 0, color };
      counts[mood].count += 1;
    });
    return Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [data]);

  return (
    <div className="border-2 border-dashed border-gray-900 bg-slate-800 p-6 sm:p-12">
      <h2 className="mb-4 text-center text-xl font-medium">
        {t('charts.moodDistribution.title')}
        <sup className="tooltip ml-1" data-tip={t('charts.moodDistribution.description')}>
          <FaRegQuestionCircle fontSize={14} />
        </sup>
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mood" name={t('charts.moodDistribution.labels.mood')} />
          <YAxis allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.95)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
            labelStyle={{ color: '#fff', fontWeight: '500' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          <Bar dataKey="count" name={t('charts.moodDistribution.labels.count')} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodDistribution;
