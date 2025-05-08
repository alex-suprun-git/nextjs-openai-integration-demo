'use client';

import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, TooltipProps } from 'recharts';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';
import { useWindowWidth, getChartAspectRatio } from '@/hooks/useWindowWidth';

// Format date specifically for chart x-axis (compact format)
const formatChartDate = (dateValue: string | Date): string => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>): ReactElement | null => {
  if (active && payload?.length) {
    const analysis = payload[0]?.payload;

    return (
      <div className="custom-tooltip relative rounded-lg border border-black/10 bg-white/5 p-8 shadow-md backdrop-blur-md">
        <div
          className="absolute left-2 top-2 z-10 h-2 w-2 rounded-full"
          style={{ background: analysis.color }}
        ></div>
        <p className="label text-sm">{analysis.fullDate || label}</p>
        <p className="intro text-xl uppercase">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

interface SentimentOverTimeProps {
  data: AnalysisEntry[];
}

const SentimentOverTimeChart = ({ data }: SentimentOverTimeProps) => {
  const t = useTranslations('StatisticsPage');
  const windowWidth = useWindowWidth();

  const formattedData = data.map((entry) => ({
    ...entry,
    fullDate: formatDate(new Date(entry.createdAt)), // Keep full date for tooltip
    createdAt: formatChartDate(entry.createdAt), // Use compact date for x-axis
  }));

  return (
    <div className="border-2 border-dashed border-gray-900 bg-slate-800 p-6">
      <h2 className="mb-12 text-center text-xl font-medium">
        {t('charts.sentimentOverTime.title')}
        <span className="hidden sm:inline">
          <sup className="tooltip ml-1" data-tip={t('charts.sentimentOverTime.description')}>
            <FaRegQuestionCircle fontSize={14} />
          </sup>
        </span>
      </h2>
      <ResponsiveContainer width="100%" aspect={getChartAspectRatio(windowWidth)}>
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 5,
            left: windowWidth < 576 ? 10 : 0,
            bottom: 5,
          }}
        >
          <Line
            type="monotone"
            dataKey="sentimentScore"
            stroke="#8884d8"
            strokeWidth={windowWidth < 576 ? 1.5 : 2}
            activeDot={{ r: windowWidth < 576 ? 6 : 8 }}
          />
          <XAxis
            dataKey="createdAt"
            tick={{ fontSize: windowWidth < 576 ? 12 : 14 }}
            angle={windowWidth < 576 ? -45 : 0}
            textAnchor={windowWidth < 576 ? 'end' : 'middle'}
            height={windowWidth < 576 ? 60 : 30}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentOverTimeChart;
