'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { Loading } from '@repo/global-ui';
import { formatDate } from '@/utils/helpers';
import { deleteEntry } from '@/utils/api';
import useKeyPress from '@/hooks/useKeyPress';

type EntryCardProps = {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  title?: string;
  color: string;
};

const EntryCard = ({ id, createdAt, title, color }: EntryCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const t = useTranslations('JournalList');
  const c = useTranslations('Global');
  const creationDate = formatDate(new Date(createdAt), locale as UserLocale);

  useEffect(() => {
    // Handle animation timing
    if (showActionSheet) {
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';

      // Show sheet with animation
      setActionSheetVisible(true);
    } else {
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setActionSheetVisible(false);
      }, 300);

      // Enable scrolling
      document.body.style.overflow = '';

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showActionSheet]);

  const deleteEntryHandler = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsLoading(true);
    await deleteEntry(id);
    setIsLoading(false);
    router.push('/');
    router.refresh();
  };

  const toggleActionSheet = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActionSheet(!showActionSheet);
  };

  const openDeleteModal = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowActionSheet(false);
    setIsModalOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isModalOpen || showActionSheet) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const closeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleOnModalClicks = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useKeyPress(() => {
    setShowActionSheet(false);
    setIsModalOpen(false);
  }, ['Escape']);

  return (
    <>
      {isLoading && <Loading fullscreen />}
      <div
        data-testid="entryCard"
        ref={cardRef}
        onClick={handleCardClick}
        className="card relative h-[128px] border border-gray-200 bg-white text-primary-content transition-all duration-200"
      >
        <div className="card-body justify-between text-black">
          <div
            style={{ backgroundColor: color }}
            className="absolute right-4 top-4 ml-auto h-2 w-2 rounded"
          ></div>
          <h2 className="card-title overflow-hidden">{title || `Memo [${creationDate}]`}</h2>
          <div className="flex justify-between">
            <div className="flex flex-col 2xl:flex-row">
              <small className="flex items-center text-[12px] 2xl:mr-3">
                <IoDocumentTextOutline /> <span className="pl-1">{creationDate}</span>
              </small>
            </div>

            <div className="relative">
              <button
                aria-label={t('card.openContextMenu')}
                data-testid="entryCard-edit-button"
                onClick={(e) => toggleActionSheet(e)}
                onTouchStart={(e) => {
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  toggleActionSheet(e);
                }}
                className="border-1 btn btn-ghost btn-xs btn-circle border-gray-300 p-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <BsThreeDotsVertical />
              </button>
            </div>
          </div>
        </div>
      </div>

      {(showActionSheet || actionSheetVisible) && (
        <div
          data-testid="entryCard-context-menu"
          className="fixed inset-0 z-[1000] flex touch-none items-end justify-center"
          style={{
            backgroundColor: showActionSheet ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
            transition: 'background-color 0.3s ease-out',
            WebkitTapHighlightColor: 'transparent',
          }}
          onClick={(e) => {
            e.preventDefault();
            if (showActionSheet) toggleActionSheet(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            if (showActionSheet) toggleActionSheet(e);
          }}
        >
          <div
            className="w-full max-w-md rounded-t-xl bg-white p-4 shadow-2xl"
            style={{
              transform: showActionSheet ? 'translateY(0)' : 'translateY(100%)',
              WebkitTransform: showActionSheet ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s ease-out, -webkit-transform 0.3s ease-out',
              touchAction: 'manipulation',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-center">
              <div className="h-1 w-16 rounded-full bg-gray-300"></div>
            </div>

            <h3 className="mb-4 text-center text-lg font-medium text-gray-800">
              {title || `Memo [${creationDate}]`}
            </h3>

            <div className="flex flex-col gap-3">
              <button
                data-testid="entryCard-delete-button"
                onClick={(e) => openDeleteModal(e)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  openDeleteModal(e);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 p-4 text-red-600 focus:outline-none active:bg-red-100"
                aria-label={c('deleteEntry.actionButton')}
                style={{ touchAction: 'manipulation' }}
              >
                <FaRegTrashAlt />
                <span>{c('deleteEntry.actionButton')}</span>
              </button>

              <button
                onClick={(e) => toggleActionSheet(e)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  toggleActionSheet(e);
                }}
                className="mt-2 flex w-full items-center justify-center rounded-md bg-gray-100 p-4 text-gray-700 focus:outline-none active:bg-gray-200"
                style={{ touchAction: 'manipulation' }}
              >
                {c('deleteEntry.cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          data-testid="delete-entry-modal"
          className="modal-open modal cursor-default"
          onClick={closeModal}
        >
          <div
            className="modal-box relative border border-gray-200 bg-white"
            onClick={handleOnModalClicks}
          >
            <h3 className="text-lg font-bold text-gray-800">{c('deleteEntry.actionButton')}</h3>
            <p className="py-4 text-gray-600">{c('deleteEntry.confirmationMessage')}</p>
            <div className="modal-action">
              <button
                data-testid="delete-cancel-button"
                className="btn btn-outline border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={closeModal}
              >
                {c('deleteEntry.cancelButton')}
              </button>
              <button
                data-testid="delete-confirm-button"
                className="btn border-0 bg-red-800 text-white hover:bg-red-900 focus:outline-none"
                onClick={deleteEntryHandler}
              >
                {c('deleteEntry.confirmButton')}
              </button>
            </div>
          </div>
          <label className="modal-backdrop" onClick={closeModal}></label>
        </div>
      )}
    </>
  );
};

export default EntryCard;
