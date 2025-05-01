'use client';

import Link from 'next/link';
import { IoReturnUpBack } from 'react-icons/io5';
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
    <div className="grid gap-10 pt-12 md:grid-cols-3 lg:min-h-svh">
      <div className="relative px-5 pb-12 md:col-span-2 md:pl-10">
        <Link href="/">
          <div className="btn mb-8 border-0 bg-slate-900 hover:bg-slate-900">
            <IoReturnUpBack />
          </div>
        </Link>

        <ContentField
          isLoading={isLoading}
          isContentEntryUpdated={isContentEntryUpdated}
          contentValue={contentValue as string}
          changeContentHandler={changeContentHandler}
          saveContentHandler={() => saveContentHandler(contentValue)}
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
