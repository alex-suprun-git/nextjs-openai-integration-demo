'use client';

import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, TooltipProps } from 'recharts';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';
import { useWindowWidth, getChartAspectRatio } from '@/hooks/useWindowWidth';

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
        <p className="label text-sm">{label}</p>
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
    createdAt: formatDate(new Date(entry.createdAt)),
  }));

  return (
    <div className="border-2 border-dashed border-gray-900 bg-slate-800 p-6">
      <h2 className="mb-12 text-center text-xl font-medium">
        {t('charts.sentimentOverTime.title')}
        <sup className="tooltip ml-1" data-tip={t('charts.sentimentOverTime.description')}>
          <FaRegQuestionCircle fontSize={14} />
        </sup>
      </h2>
      <ResponsiveContainer aspect={getChartAspectRatio(windowWidth)}>
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
          <XAxis dataKey="createdAt" tick={{ fontSize: windowWidth < 576 ? 14 : 16 }} />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentOverTimeChart;
