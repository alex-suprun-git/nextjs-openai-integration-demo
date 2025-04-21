'use client';

import { ReactElement } from 'react';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/utils/helpers';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, TooltipProps } from 'recharts';

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
        <p className="label text-sm text-stone-300">{label}</p>
        <p className="intro text-xl uppercase text-stone-300">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

const SentimentOverTimeChart = ({ data }: { data: AnalysisEntry[] }) => {
  const t = useTranslations('StatisticsPage');

  const formattedData = data.map((entry) => ({
    ...entry,
    updatedAt: formatDate(new Date(entry.updatedAt)),
  }));

  return (
    <div className="border-2 border-dashed border-gray-900 bg-slate-800 p-6 sm:p-12">
      <h2 className="mb-12 text-center text-xl font-medium text-stone-200">
        {t('charts.sentimentOverTime')}
      </h2>
      <ResponsiveContainer aspect={2}>
        <LineChart width={300} height={200} data={formattedData}>
          <Line
            type="monotone"
            dataKey="sentimentScore"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <XAxis dataKey="updatedAt" />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentOverTimeChart;
