import { useCallback, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrompt } from '@/contexts/PromptContext';
import { updateEntry, createNewEntry, updateUserPromptUsage } from '@/utils/api';
import { ENTRIES_BASE_PATH, MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

export const useEditor = (entry: EditorEntry) => {
  const pathname = usePathname();
  const router = useRouter();

  const { symbolsUsed, symbolsLimit } = usePrompt();
  const isPromptSymbolsExceeded = +symbolsUsed >= +symbolsLimit;

  const [contentValue, setContentValue] = useState(entry?.content);
  const [_isContentChanged, setIsContentChanged] = useState(false);
  const [isContentEntryUpdated, setIsContentEntryUpdated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry?.analysis);
  const entryCreatedRef = useRef(false);

  const saveContentHandler = useCallback(
    async (_contentValue: string) => {
      if (_contentValue.length < MINIMUM_CONTENT_LENGTH) return;

      setIsLoading(true);

      try {
        if (pathname === '/new-entry') {
          if (!entryCreatedRef.current) {
            entryCreatedRef.current = true;
            const { id } = await createNewEntry(_contentValue);
            await updateUserPromptUsage(_contentValue.length);
            router.push(`${ENTRIES_BASE_PATH}/${id}`);
            router.refresh();
          }
        } else if (entry.id && entry.content !== _contentValue) {
          const { analysis: updatedAnalysis } = await updateEntry(entry.id, _contentValue);
          setAnalysis(updatedAnalysis);
          setIsContentEntryUpdated(true);
          await updateUserPromptUsage(_contentValue.length);
          router.refresh();
          setTimeout(() => setIsContentEntryUpdated(false), 1500);
        }
      } catch (error) {
        console.error('Error saving content:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [pathname, entry.id, entry.content, router],
  );

  const changeContentHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value.replace(/ {3,}/g, ' '.repeat(1));
    const isNewContentLengthValid = content.length >= MINIMUM_CONTENT_LENGTH;

    setContentValue(content);
    if (isNewContentLengthValid) {
      setIsContentChanged(true);
    }
  };

  return {
    contentValue,
    isLoading,
    isContentEntryUpdated,
    analysis,
    changeContentHandler,
    saveContentHandler,
    isPromptSymbolsExceeded,
    entryCreatedRef,
  };
};
