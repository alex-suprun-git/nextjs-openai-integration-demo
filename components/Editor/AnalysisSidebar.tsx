'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { deleteEntry } from '@/utils/api';
import { FaRegTrashAlt } from 'react-icons/fa';
import { convertHexToRGBA } from '@/utils/helpers';

function AnalysisSidebar({
  entryId,
  analysis,
  router,
}: {
  entryId?: string;
  analysis: AnalysisData;
  router: AppRouterInstance;
}) {
  const deleteEntryHandler = async (id: string) => {
    await deleteEntry(id);
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
  const analysisImage = negative
    ? "bg-[url('/analysis/negative.jpg')]"
    : "bg-[url('/analysis/positive.jpg')]";

  return (
    <>
      <div className={`relative px-6 py-10 ${analysisImage}`}>
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
            key={item.label}
            className="flex items-center justify-between border-b-2 border-white/10 px-6 py-3"
          >
            <h3 className="mr-10 font-semibold">{item.label}:</h3>
            <span className="text-end">{item.value?.toString()}</span>
          </li>
        ))}
      </ul>
      {isEntryCanBeDeleted && (
        <div className="mt-12 flex justify-end pb-10 pr-5 md:pb-0 md:pr-0">
          <button
            onClick={() => deleteEntryHandler(entryId as string)}
            className="btn bg-red-800 text-white hover:bg-red-900"
          >
            Delete this note <FaRegTrashAlt />
          </button>
        </div>
      )}
    </>
  );
}

export default AnalysisSidebar;
