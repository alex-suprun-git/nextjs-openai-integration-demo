import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { IoReturnUpBack } from 'react-icons/io5';
import { getCurrentUser } from '@/utils/auth';
import { prisma } from '@/utils/db';
import Editor from '@/components/Editor';

// Use React's cache to deduplicate data fetching
const getEntry = cache(async (id: string) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

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
});

// Generate metadata using cached data fetch
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getEntry(id);

  if (!entry || !entry.analysis) {
    return {
      title: 'Entry Not Found',
    };
  }

  return {
    title: `${entry.analysis.title}`,
  };
}

const EntryPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await getEntry(id);

  if (!entry || !entry.analysis) {
    return notFound();
  }

  return (
    <div data-testid="entryPage" className="container mx-auto py-10 pb-32 xl:px-10">
      <Link href="/" className="px-6">
        <div className="btn mb-8 border-0 bg-slate-900 px-6 text-white hover:bg-slate-900">
          <IoReturnUpBack />
        </div>
      </Link>
      <Editor entry={entry as Required<AnalysisSubEntry>} />
    </div>
  );
};
export default EntryPage;
