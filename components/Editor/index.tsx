'use client';

import { useCallback, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAutosave } from 'react-autosave';
import { usePrompt } from '@/contexts/PromptContext';
import { updateEntry, createNewEntry, updateUser } from '@/utils/api';
import AnalysisSidebar from './AnalysisSidebar';
import ContentField from './ContentField';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

const Editor = ({ entry }: { entry: { content: string; id?: string; analysis: AnalysisData } }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { promptSymbolsUsed, promptSymbolsLimit } = usePrompt();
  const isPromptSymbolsExceeded = promptSymbolsUsed >= promptSymbolsLimit;

  const [contentValue, setContentValue] = useState(entry?.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry?.analysis);
  const entryCreatedRef = useRef(false);

  const saveContent = useCallback(
    async (_contentValue: string) => {
      setIsLoading(true);
      if (_contentValue.length > MINIMUM_CONTENT_LENGTH) {
        if (pathname === '/journal/new-entry') {
          if (!entryCreatedRef.current) {
            entryCreatedRef.current = true;
            const { id } = await createNewEntry(_contentValue);
            await updateUser(promptSymbolsUsed + _contentValue.length);
            router.push(`/journal/${id}`);
            router.refresh();
          }
        } else if (entry.id && entry.content !== _contentValue) {
          const { analysis: updatedAnalysis } = await updateEntry(entry.id, _contentValue);
          setAnalysis(updatedAnalysis);
          await updateUser(promptSymbolsUsed + _contentValue.length);
          router.refresh();
        }
      }
      setIsLoading(false);
    },
    [entry.content, entry.id, pathname, promptSymbolsUsed, router],
  );

  useAutosave({
    data: contentValue,
    onSave: saveContent,
    interval: 3500,
  });

  return (
    <div className="grid gap-10 pt-12 md:grid-cols-3 md:max-lg:h-[80%] lg:min-h-svh">
      <div className="relative px-5 pb-12 md:col-span-2 md:pl-10">
        <ContentField
          isLoading={isLoading}
          contentValue={contentValue}
          setContentValue={setContentValue}
          entryCreatedRef={entryCreatedRef}
          isPromptSymbolsExceeded={isPromptSymbolsExceeded}
        />
      </div>
      <div className="border-l border-black/10 bg-gray-800 md:pr-10">
        <AnalysisSidebar router={router} entryId={entry?.id} analysis={analysis} />
      </div>
    </div>
  );
};
export default Editor;
