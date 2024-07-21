import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAutosave } from 'react-autosave';
import { debounce } from 'lodash';
import { usePrompt } from '@/contexts/PromptContext';
import { updateEntry, createNewEntry, updateUser } from '@/utils/api';
import { AUTOSAVE_INTERVAL, MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

export const useEditor = (entry: EditorEntry) => {
  const pathname = usePathname();
  const router = useRouter();

  const { symbolsUsed, symbolsLimit } = usePrompt();
  const isPromptSymbolsExceeded = +symbolsUsed >= +symbolsLimit;

  const [autoSaveTimerValue, setAutoSaveTimerValue] = useState(0);
  const isShowAutoSaveTimer = autoSaveTimerValue > 0 && autoSaveTimerValue < 100;

  const [contentValue, setContentValue] = useState(entry?.content);
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [isContentEntryUpdated, setIsContentEntryUpdated] = useState(false);

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
            await updateUser(+symbolsUsed + _contentValue.length);
            router.push(`/journal/${id}`);
            router.refresh();
          }
        } else if (entry.id && entry.content !== _contentValue) {
          const { analysis: updatedAnalysis } = await updateEntry(entry.id, _contentValue);
          setAnalysis(updatedAnalysis);
          setIsContentEntryUpdated(true);
          await updateUser(+symbolsUsed + _contentValue.length);
          router.refresh();
          setTimeout(() => setIsContentEntryUpdated(false), 1500);
        }
      }
      setIsLoading(false);
    },
    [entry.content, entry.id, pathname, symbolsUsed, router],
  );

  useAutosave({
    data: contentValue as string,
    onSave: saveContent,
    interval: AUTOSAVE_INTERVAL,
  });

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

  return {
    contentValue,
    isLoading,
    isContentEntryUpdated,
    analysis,
    autoSaveTimerValue,
    isShowAutoSaveTimer,
    contentChangeHandler,
    isPromptSymbolsExceeded,
    entryCreatedRef,
    saveContent, // Ensure saveContent is returned
    isContentChanged, // Ensure isContentChanged is returned
  };
};
