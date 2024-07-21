'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Editor');

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
    { label: t('analysis.labels.summary'), value: summary },
    { label: t('analysis.labels.subject'), value: subject },
    { label: t('analysis.labels.mood'), value: mood },
    { label: t('analysis.labels.negative'), value: negative },
  ];

  const analysisBackground = convertHexToRGBA(color, 0.25);

  return (
    <>
      {isLoading && <Loading fullscreen />}
      <div className="relative px-6 py-10" style={{ background: getMoodImage(analysis) }}>
        <h2 className="relative z-10 w-fit bg-gray-800 p-6 text-2xl font-bold text-white">
          {t('analysis.headline')}
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
            className="md:max-lg:flex-col md:max-lg:items-start flex items-center justify-between border-b-2 border-white/10 px-6 py-3"
          >
            <h3 className="md:max-lg:mb-2 mr-10 font-semibold">{item.label}:</h3>
            <span className="md:max-lg:text-start text-end">{item.value?.toString()}</span>
          </li>
        ))}
      </ul>
      {isEntryCanBeDeleted && (
        <div className="mt-12 flex justify-end pb-10 pr-5 md:pb-0 md:pr-0">
          <button
            onClick={() => deleteEntryHandler(entryId as string)}
            data-testid="delete-entry-button"
            className="md:max-lg:mb-10 btn bg-red-800 text-white hover:bg-red-900"
          >
            {t('buttons.deleteEntry')} <FaRegTrashAlt />
          </button>
        </div>
      )}
    </>
  );
}

export default AnalysisSidebar;
