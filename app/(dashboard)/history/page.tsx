import HistoryChart from '@/components/HistoryChart';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const averageSentiment = Math.round(
    analyses.reduce((acc, { sentimentScore }) => acc + sentimentScore, 0) / analyses.length,
  );

  return { analyses, averageSentiment };
};

const History = async () => {
  const { analyses, averageSentiment } = await getData();
  return (
    <div className="w-full h-full">
      <h1 className="text-3xl font-bold">History</h1>
      <p className="text-xl">Average sentiment: {averageSentiment}</p>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default History;
