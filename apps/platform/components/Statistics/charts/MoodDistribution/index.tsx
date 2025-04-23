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
      <h2 className="mb-4 text-center text-xl font-medium text-stone-200">
        {t('charts.moodDistribution.title')}
        <sup className="tooltip ml-1" data-tip={t('charts.moodDistribution.description')}>
          <FaRegQuestionCircle fontSize={14} />
        </sup>
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mood" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodDistribution;
