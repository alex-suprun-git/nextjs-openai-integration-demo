'use client';
import { formatDate } from '@/utils/helpers';
import { ReactElement } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, TooltipProps } from 'recharts';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>): ReactElement | null => {
  if (active && payload?.length) {
    const analysis = payload[0].payload;

    return (
      <div className="custom-tooltip relative rounded-lg border border-black/10 bg-white/5 p-8 shadow-md backdrop-blur-md">
        <div
          className="absolute left-2 top-2 h-2 w-2 rounded-full"
          style={{ background: analysis.color }}
        ></div>
        <p className="label text-sm">{label}</p>
        <p className="intro text-xl uppercase">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

const HistoryChart = ({ data }: { data: AnalysisEntry[] }) => {
  const formattedData = data.map((entry) => ({
    ...entry,
    updatedAt: formatDate(new Date(entry.updatedAt)),
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer aspect={3}>
        <LineChart width={300} height={100} data={formattedData}>
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

export default HistoryChart;
