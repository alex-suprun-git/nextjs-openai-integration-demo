'use client';

import AnalysisSidebar from './AnalysisSidebar';
import ContentField from './ContentField';
import { useRouter } from 'next/navigation';
import { useEditor } from '@/hooks/useEditor';

const Editor = ({ entry }: { entry: EditorEntry }) => {
  const {
    contentValue,
    isLoading,
    isContentEntryUpdated,
    analysis,
    changeContentHandler,
    saveContentHandler,
    isPromptSymbolsExceeded,
    entryCreatedRef,
  } = useEditor(entry);

  const router = useRouter();
  return (
    <div className="grid gap-12 md:grid-cols-[60%_40%]">
      <ContentField
        isLoading={isLoading}
        isContentEntryUpdated={isContentEntryUpdated}
        contentValue={contentValue as string}
        changeContentHandler={changeContentHandler}
        saveContentHandler={() => saveContentHandler(contentValue)}
        entryCreatedRef={entryCreatedRef}
        isPromptSymbolsExceeded={isPromptSymbolsExceeded}
      />
      <AnalysisSidebar router={router} entryId={entry?.id} analysis={analysis} />
    </div>
  );
};

export default Editor;
