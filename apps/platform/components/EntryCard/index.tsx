'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { FiEdit } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { Loading } from '@repo/global-ui/index';
import { formatDate } from '@/utils/helpers';
import { deleteEntry } from '@/utils/api';
import useKeyPress from '@/hooks/useKeyPress';

type EntryCardProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  color: string;
};

const EntryCard = ({ id, createdAt, updatedAt, title, color }: EntryCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [creationDate, setCreationDate] = useState<string>('');
  const [updatedDate, setUpdatedDate] = useState<string>('');
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const t = useTranslations('JournalList');
  const locale = useLocale();

  const handleOuterClick = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as HTMLElement)) {
      setIsContextMenuOpen(false);
    }
  };

  useEffect(() => {
    setCreationDate(formatDate(new Date(createdAt), locale as UserLocale));
    setUpdatedDate(formatDate(new Date(updatedAt), locale as UserLocale));
  }, [createdAt, updatedAt, locale]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOuterClick);
    return () => {
      document.removeEventListener('mousedown', handleOuterClick);
    };
  }, []);

  const deleteEntryHandler = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsLoading(true);
    await deleteEntry(id);
    setIsLoading(false);
    router.push('/');
    router.refresh();
  };

  const contextMenuHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  useKeyPress(() => setIsContextMenuOpen(false), ['Escape']);

  return (
    <>
      {isLoading && <Loading fullscreen />}
      <div
        data-testid="entryCard"
        ref={cardRef}
        onContextMenu={(e) => contextMenuHandler(e)}
        className="card relative h-[128px] bg-white text-primary-content shadow-md"
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
              {updatedDate !== creationDate && (
                <small className="flex items-center text-[12px]">
                  <FiEdit /> <span className="pl-1">{updatedDate}</span>
                </small>
              )}
            </div>

            <button
              aria-label={t('card.openContextMenu')}
              data-testid="entryCard-edit-button"
              onClick={(e) => contextMenuHandler(e)}
            >
              <BsThreeDotsVertical />
            </button>
          </div>
          {isContextMenuOpen && (
            <div
              data-testid="entryCard-context-menu"
              className="absolute left-0 top-0 z-10 flex h-full w-full items-end justify-end rounded-xl bg-slate-700 bg-opacity-55"
            >
              <button
                data-testid="entryCard-delete-button"
                className="btn h-[30%] w-[100%] items-center justify-center border-0"
                onClick={(e) => deleteEntryHandler(e, id)}
                aria-label={t('card.deleteEntry')}
              >
                <FaRegTrashAlt />
                <span className="ml-1 font-semibold">{t('card.deleteEntry')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EntryCard;
