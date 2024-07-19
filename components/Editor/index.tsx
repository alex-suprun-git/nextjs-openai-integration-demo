'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAutosave } from 'react-autosave';
import { debounce } from 'lodash';
import { usePrompt } from '@/contexts/PromptContext';
import { updateEntry, createNewEntry, updateUser } from '@/utils/api';
import AnalysisSidebar from './AnalysisSidebar';
import ContentField from './ContentField';
import { AUTOSAVE_INTERVAL, MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

const Editor = ({ entry }: { entry: { content: string; id?: string; analysis: AnalysisData } }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { promptSymbolsUsed, promptSymbolsLimit } = usePrompt();
  const isPromptSymbolsExceeded = promptSymbolsUsed >= promptSymbolsLimit;

  const [autoSaveTimerValue, setAutoSaveTimerValue] = useState(0);
  const isShowAutoSaveTimer = autoSaveTimerValue > 0 && autoSaveTimerValue < 100;

  const [contentValue, setContentValue] = useState(entry?.content);
  const [isContentChanged, setIsContentChanged] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry?.analysis);
  const entryCreatedRef = useRef(false);

  const saveContent = useCallback(
    async (_contentValue: string) => {
      setIsLoading(true);
      if (_contentValue.length >= MINIMUM_CONTENT_LENGTH) {
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
    interval: AUTOSAVE_INTERVAL,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutosaveCountdown = useCallback(
    debounce(() => {
      setAutoSaveTimerValue(0);
      const intervalId = setInterval(() => {
        setAutoSaveTimerValue((prevValue) => {
          if (prevValue < 100) {
            return prevValue + 1;
          } else {
            clearInterval(intervalId);
            return 100;
          }
        });
      }, 20);
    }, 1500),
    [],
  );

  useEffect(() => {
    if (!isTyping && isContentChanged) {
      debouncedAutosaveCountdown();
      setAutoSaveTimerValue(0);
    }
  }, [isContentChanged, isTyping, debouncedAutosaveCountdown]);

  const contentChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value.replace(/ {3,}/g, ' '.repeat(1));
    const isNewContentLengthValid = content.length >= MINIMUM_CONTENT_LENGTH;

    setContentValue(content);
    if (isNewContentLengthValid) {
      setIsContentChanged(true);
      setIsTyping(true);
    }
    setTimeout(() => setIsTyping(false), 10);
  };

  return (
    <div className="grid gap-10 pt-12 md:grid-cols-3 md:max-lg:h-[80%] lg:min-h-svh">
      <div className="relative px-5 pb-12 md:col-span-2 md:pl-10">
        {isShowAutoSaveTimer && (
          <progress
            className="progress mb-2 w-full"
            value={autoSaveTimerValue}
            max="100"
          ></progress>
        )}
        <ContentField
          isLoading={isLoading}
          contentValue={contentValue}
          contentChangeHandler={contentChangeHandler}
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
