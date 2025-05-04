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
  const [showDropdown, setShowDropdown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const t = useTranslations('JournalList');
  const c = useTranslations('Global');
  const creationDate = formatDate(new Date(createdAt), locale as UserLocale);

  const handleOuterClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOuterClick);
    return () => {
      document.removeEventListener('mousedown', handleOuterClick);
    };
  }, []);

  const deleteEntryHandler = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsLoading(true);
    await deleteEntry(id);
    setIsLoading(false);
    router.push('/');
    router.refresh();
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    setIsModalOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (dropdownRef.current?.contains(e.target as Node) || isModalOpen) {
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
    setShowDropdown(false);
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

            <div className="dropdown dropdown-end" ref={dropdownRef}>
              <button
                aria-label={t('card.openContextMenu')}
                data-testid="entryCard-edit-button"
                onClick={toggleDropdown}
                className="border-1 btn btn-ghost btn-xs btn-circle border-gray-300 p-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <BsThreeDotsVertical />
              </button>
              {showDropdown && (
                <ul
                  data-testid="entryCard-context-menu"
                  className="dropdown-content menu menu-sm z-[100] mt-1 w-48 rounded-md border border-gray-200 bg-white p-0 focus:outline-none"
                >
                  <li className="rounded-md">
                    <button
                      data-testid="entryCard-delete-button"
                      onClick={openDeleteModal}
                      className="btn btn-sm items-center gap-2 border-0 bg-gray-50 py-2 text-sm text-red-600 focus:outline-none"
                      aria-label={c('deleteEntry.actionButton')}
                    >
                      <FaRegTrashAlt />
                      <span>{c('deleteEntry.actionButton')}</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-open modal cursor-default" onClick={closeModal}>
          <div
            className="modal-box relative border border-gray-200 bg-white"
            onClick={handleOnModalClicks}
          >
            <h3 className="text-lg font-bold text-gray-800">{c('deleteEntry.actionButton')}</h3>
            <p className="py-4 text-gray-600">{c('deleteEntry.confirmationMessage')}</p>
            <div className="modal-action">
              <button
                className="btn btn-outline border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={closeModal}
              >
                {c('deleteEntry.cancelButton')}
              </button>
              <button
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
