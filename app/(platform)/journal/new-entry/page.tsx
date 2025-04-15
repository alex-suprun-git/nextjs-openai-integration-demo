import { Metadata } from 'next';
import Editor from '@/components/Editor';

export const metadata: Metadata = {
  title: 'New Entry | OpenAI Daily Journal',
  description: 'New entry page for OpenAI Daily Journal',
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
    },
  };

  return <Editor entry={initialData} />;
}

export default NewEntryPage;
