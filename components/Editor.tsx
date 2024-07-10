'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useAutosave } from 'react-autosave';
import { Alert } from '@/ui-lib';
import { updateEntry, createNewEntry, deleteEntry } from '@/utils/api';

const MINIMUM_CONTENT_LENGTH = 30;

const Editor = ({ entry }: { entry: { content: string; id?: string; analysis: AnalysisData } }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [contentValue, setContentValue] = useState(entry?.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry?.analysis);
  const entryCreatedRef = useRef(false);

  const isContentTooShort = contentValue.length < MINIMUM_CONTENT_LENGTH;
  const isContentEntryCreated = entryCreatedRef.current;
  const isCanBeDeleted = entry?.id;

  const saveContent = useCallback(
    async (_contentValue: string) => {
      setIsLoading(true);
      if (_contentValue.length > MINIMUM_CONTENT_LENGTH) {
        if (pathname === '/journal/new-entry') {
          if (!entryCreatedRef.current) {
            entryCreatedRef.current = true;
            const { id } = await createNewEntry(_contentValue);
            router.push(`/journal/${id}`);
            router.refresh();
          }
        } else if (entry.id && entry.content !== _contentValue) {
          const { analysis: updatedAnalysis } = await updateEntry(entry.id, _contentValue);
          setAnalysis(updatedAnalysis);
        }
      }
      setIsLoading(false);
    },
    [entry.content, entry.id, pathname, router],
  );

  useAutosave({
    data: contentValue,
    onSave: saveContent,
  });

  const deleteEntryHandler = async (id: string) => {
    await deleteEntry(id);
    router.push('/journal');
    router.refresh();
  };

  const { summary, subject, mood, color, negative } = analysis;

  const analysisData = [
    { label: 'Summary', value: summary },
    { label: 'Subject', value: subject },
    { label: 'Mood', value: mood },
    { label: 'Negative', value: negative },
  ];

  return (
    <div className="grid gap-10 pt-12 md:min-h-svh md:grid-cols-3">
      <div className="relative px-5 pb-12 md:col-span-2 md:pl-10">
        {isContentTooShort && (
          <Alert>
            Please enter at least 30 characters. Changes are not saved for entries with fewer than
            30 characters.
          </Alert>
        )}
        {isContentEntryCreated && (
          <Alert type="success">A new note was created. Redirecting....</Alert>
        )}
        {isLoading && <div className="loading loading-lg absolute inset-x-2/4 inset-y-2/4"></div>}
        <textarea
          className="textarea min-h-72 w-full resize-none p-10 text-xl outline-none md:min-h-svh"
          value={contentValue}
          onChange={(e) => {
            setContentValue((prevValue: string) =>
              e.target.value !== '' ? e.target.value : prevValue,
            );
          }}
          placeholder="Please write your thoughts here..."
          maxLength={2500}
          required
        />
      </div>
      <div className="border-l border-black/10 bg-gray-800 md:pr-10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="w-fit bg-gray-800 p-6 text-2xl font-bold text-white">Analysis</h2>
        </div>
        <ul className="mt-5">
          {analysisData.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between border-b-2 border-white/10 px-6 py-3"
            >
              <h3 className="mr-10 font-semibold">{item.label}:</h3>
              <span className="text-end">{item.value?.toString()}</span>
            </li>
          ))}
        </ul>
        {isCanBeDeleted && (
          <div className="mt-12 flex justify-end pb-10 pr-5 md:pb-0 md:pr-0">
            <button
              onClick={() => deleteEntryHandler(entry.id as string)}
              className="btn bg-red-800 text-white hover:bg-red-900"
            >
              Delete this note <FaRegTrashAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Editor;
