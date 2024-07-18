'use client';

import { useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { deleteEntry } from '@/utils/api';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Loading } from '@/ui-lib';
import { convertHexToRGBA, getMoodImage } from '@/utils/helpers';

function AnalysisSidebar({
  entryId,
  analysis,
  router,
}: {
  entryId?: string;
  analysis: AnalysisData;
  router: AppRouterInstance;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteEntryHandler = async (id: string) => {
    setIsLoading(true);
    await deleteEntry(id);
    setIsLoading(false);
    router.push('/journal');
    router.refresh();
  };

  const isEntryCanBeDeleted = entryId;
  const { summary, subject, mood, color, negative } = analysis;

  const analysisData = [
    { label: 'Summary', value: summary },
    { label: 'Subject', value: subject },
    { label: 'Mood', value: mood },
    { label: 'Negative', value: negative },
  ];

  const analysisBackground = convertHexToRGBA(color, 0.25);

  return (
    <>
      {isLoading && <Loading fullscreen />}
      <div className="relative px-6 py-10" style={{ background: getMoodImage(analysis) }}>
        <h2 className="relative z-10 w-fit bg-gray-800 p-6 text-2xl font-bold text-white">
          Analysis
        </h2>
        <div
          className="absolute left-0 top-0 h-full w-full"
          style={{ background: analysisBackground }}
        ></div>
      </div>
      <ul className="mt-5">
        {analysisData.map((item) => (
          <li
            data-testid={'analysis-item'}
            key={item.label}
            className="flex items-center justify-between border-b-2 border-white/10 px-6 py-3 md:max-lg:flex-col md:max-lg:items-start"
          >
            <h3 className="mr-10 font-semibold md:max-lg:mb-2">{item.label}:</h3>
            <span className="text-end md:max-lg:text-start">{item.value?.toString()}</span>
          </li>
        ))}
      </ul>
      {isEntryCanBeDeleted && (
        <div className="mt-12 flex justify-end pb-10 pr-5 md:pb-0 md:pr-0">
          <button
            onClick={() => deleteEntryHandler(entryId as string)}
            data-testid="delete-entry-button"
            className="btn bg-red-800 text-white hover:bg-red-900 md:max-lg:mb-10"
          >
            Delete this note <FaRegTrashAlt />
          </button>
        </div>
      )}
    </>
  );
}

export default AnalysisSidebar;
