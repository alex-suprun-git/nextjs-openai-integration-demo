'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { deleteEntry } from '@/utils/api';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Loading } from '@repo/global-ui';
import { convertHexToRGBA, getMoodImage } from '@/utils/helpers';
import Modal from '@/components/Modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('Editor');
  const c = useTranslations('Global');

  const deleteEntryHandler = async () => {
    if (!entryId) return;
    setIsLoading(true);
    await deleteEntry(entryId);
    setIsLoading(false);
    router.push('/');
    router.refresh();
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const isEntryCanBeDeleted = !!entryId;
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
        <h2 className="relative z-10 w-fit bg-gray-800 p-6 text-2xl font-bold">
          {t('analysis.headline')}
        </h2>
        <div
          className="absolute left-0 top-0 h-full w-full"
          style={{ background: analysisBackground }}
        ></div>
      </div>
      <ul className="mb-10 mt-5">
        {analysisData.map((item) => {
          if (item.value === summary && isEntryCanBeDeleted) {
            return (
              <li
                data-testid={`analysis-item analysis-item-${item.value}`}
                key={item.label}
                className="mb-6 flex flex-col border-b-2 border-white/10 px-6 pb-6"
              >
                <h3 className="mb-2 text-center font-semibold">{item.label}:</h3>
                <span className="text-center">{item.value?.toString()}</span>
              </li>
            );
          } else {
            return (
              <li
                data-testid={`analysis-item analysis-item-${item.value}`}
                key={item.label}
                className="flex flex-col items-start justify-between border-b-2 border-white/10 px-6 py-3 xl:flex-row xl:items-center"
              >
                <h3 className="mb-2 mr-10 font-semibold">{item.label}:</h3>
                <span className="text-start xl:text-end">{item.value?.toString()}</span>
              </li>
            );
          }
        })}
      </ul>
      {isEntryCanBeDeleted && (
        <div className="mt-12 flex justify-end pb-10 pr-5 md:pb-0 md:pr-0">
          <button
            onClick={openDeleteModal}
            data-testid="delete-entry-button"
            className="md:max-lg:mb-10 btn border-0 bg-red-800 text-white hover:bg-red-900"
          >
            {c('deleteEntry.actionButton')} <FaRegTrashAlt />
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={c('deleteEntry.actionButton')}
        confirmButton={{
          label: c('deleteEntry.confirmButton'),
          onClick: deleteEntryHandler,
          testId: 'delete-entry-confirm-button',
        }}
        cancelButton={{
          label: c('deleteEntry.cancelButton'),
          testId: 'delete-entry-cancel-button',
        }}
        testId="delete-entry-modal"
      >
        {c('deleteEntry.confirmationMessage')}
      </Modal>
    </>
  );
}

export default AnalysisSidebar;
