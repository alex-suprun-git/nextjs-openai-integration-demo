'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';

const Editor = ({ entry }: { entry: any }) => {
  const [contentValue, setContentValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  useAutosave({
    data: contentValue,
    interval: 1000,
    onSave: async (_contentValue) => {
      setIsLoading(true);
      if (entry.id) {
        const { analysis: updatedAnalysis } = await updateEntry(entry.id, _contentValue);
        setAnalysis(updatedAnalysis);
      }
      setIsLoading(false);
    },
  });

  const { summary, subject, mood, color, negative } = analysis;

  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative },
  ];

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div>Loading...</div>}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={contentValue}
          onChange={(e) => setContentValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl font-bold">Analysis</h2>
        </div>
        <ul>
          {analysisData.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between py-3 px-3 border-b-2 border-black/10"
            >
              <h3 className="font-semibold">{item.name}</h3>
              <span>{item.value?.toString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
