import { Metadata } from 'next';
import StatisticsData from '@/components/Statistics';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

export const metadata: Metadata = {
  title: 'Statistics',
};

const getData = async () => {
  const user = await getUserByClerkId();
  if (!user) {
    return { analyses: [], averageSentiment: null };
  }

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

const StatisticsPage = async () => {
  const { analyses, averageSentiment } = await getData();

  return <StatisticsData analyses={analyses} averageSentiment={averageSentiment} />;
};

export default StatisticsPage;
