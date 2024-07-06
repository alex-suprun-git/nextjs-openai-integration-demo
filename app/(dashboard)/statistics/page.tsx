import Heading from '@/components/Heading';
import HistoryChart from '@/components/HistoryChart';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses: AnalysisEntryResponse[] | [] = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const averageSentiment = analyses.length
    ? Math.round(
        analyses.reduce((acc, { sentimentScore }) => acc + sentimentScore, 0) / analyses.length,
      )
    : null;

  return { analyses, averageSentiment };
};

const History = async () => {
  const { analyses, averageSentiment } = await getData();

  return (
    <div className="p-10">
      <Heading>Statistics</Heading>
      {analyses.length === 0 ? (
        <p className="text-xl">There is no data to display yet.</p>
      ) : (
        <>
          <p className="mb-12 text-xl">Average sentiment: {averageSentiment}</p>
          <HistoryChart data={analyses as AnalysisEntry[]} />
        </>
      )}
    </div>
  );
};

export default History;
