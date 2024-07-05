import Editor from '@/components/Editor';
import React from 'react';

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
