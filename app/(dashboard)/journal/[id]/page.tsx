import { notFound } from 'next/navigation';
import Editor from '@/components/Editor';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const entry: AnalysisEntryResponse = await getEntry(params.id);

  if (!entry || !entry.analysis) {
    notFound();
  }

  return <Editor entry={entry as Required<AnalysisSubEntry>} />;
};
export default EntryPage;
