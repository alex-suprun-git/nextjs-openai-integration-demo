import { Metadata } from 'next';
import Link from 'next/link';
import { IoReturnUpBack } from 'react-icons/io5';
import Editor from '@/components/Editor';

export const metadata: Metadata = {
  title: 'New Entry | OpenAI Daily Dashboard',
  description: 'New entry page for OpenAI Daily Dashboard',
};

function NewEntryPage() {
  const initialData = {
    content: '',
    analysis: {
      summary: 'unknown',
      subject: 'unknown',
      mood: 'unknown',
      color: '#4B5563',
      negative: false,
      sentimentScore: 0,
      title: '',
    },
  };

  return (
    <div data-testid="newEntryPage" className="container mx-auto py-10 pb-32 xl:px-10">
      <Link href="/" className="px-6">
        <div className="btn mb-8 border-0 bg-slate-900 text-white hover:bg-slate-900">
          <IoReturnUpBack />
        </div>
      </Link>
      <Editor entry={initialData} />
    </div>
  );
}

export default NewEntryPage;
