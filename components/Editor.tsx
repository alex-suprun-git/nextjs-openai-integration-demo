'use client';

import { updateEntry } from '@/utils/api';
import { FC, useState } from 'react';
import { useAutosave } from 'react-autosave';

const Editor: FC<{ entry: Partial<Entry> }> = ({ entry }) => {
  const [contentValue, setContentValue] = useState(entry?.content);
  const [isLoading, setIsLoading] = useState(false);

  useAutosave({
    data: contentValue,
    interval: 1000,
    onSave: async (_contentValue) => {
      setIsLoading(true);
      if (entry?.id) {
        await updateEntry(entry.id, _contentValue);
      }
      setIsLoading(false);
    },
  });

  return (
    <div className="w-full h-full">
      {isLoading && <div>Loading...</div>}
      <textarea
        className="w-full h-full p-8 text-xl outline-none"
        value={contentValue}
        onChange={(e) => setContentValue(e.target.value)}
      />
    </div>
  );
};

export default Editor;
