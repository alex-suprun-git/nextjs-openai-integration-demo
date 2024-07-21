'use client';

import AnalysisSidebar from './AnalysisSidebar';
import ContentField from './ContentField';
import { useEditor } from '@/hooks/useEditor';
import { useRouter } from 'next/navigation';

const Editor = ({ entry }: { entry: EditorEntry }) => {
  const {
    contentValue,
    isLoading,
    isContentEntryUpdated,
    analysis,
    autoSaveTimerValue,
    isShowAutoSaveTimer,
    contentChangeHandler,
    isPromptSymbolsExceeded,
    entryCreatedRef,
  } = useEditor(entry);

  const router = useRouter();
  return (
    <div className="md:max-lg:h-[80%] grid gap-10 pt-12 md:grid-cols-3 lg:min-h-svh">
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
          isContentEntryUpdated={isContentEntryUpdated}
          contentValue={contentValue as string}
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
