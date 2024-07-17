'use client';

import { FaRegTrashAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import { formatDate, getExcerpt } from '@/utils/helpers';
import { useState, useRef, useEffect } from 'react';
import { deleteEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import useKeyPress from '@/hooks/useKeyPress';

type EntryCardProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  color: string;
};

const EntryCard = ({ id, createdAt, updatedAt, content, color }: EntryCardProps) => {
  const router = useRouter();
  const creationDate = formatDate(createdAt);
  const updatedDate = formatDate(updatedAt);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const deleteEntryHandler = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    await deleteEntry(id);
    router.push('/journal');
    router.refresh();
  };

  const contextMenuHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  useKeyPress(() => setIsContextMenuOpen(false), ['Escape']);

  const handleOuterClick = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as HTMLElement)) {
      setIsContextMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOuterClick);
    return () => {
      document.removeEventListener('mousedown', handleOuterClick);
    };
  }, []);

  return (
    <div
      data-testid="entryCard"
      ref={cardRef}
      onContextMenu={(e) => contextMenuHandler(e)}
      className="card relative bg-white text-primary-content shadow-md"
    >
      <div className="card-body">
        <div
          style={{ backgroundColor: color }}
          className="absolute right-4 top-4 ml-auto h-2 w-2 rounded"
        ></div>
        <h2 className="card-title overflow-hidden">{getExcerpt(content)}</h2>
        <div className="flex justify-between">
          <small className="flex items-center text-[12px]">
            <IoDocumentTextOutline /> <span className="pl-1">{creationDate}</span>
          </small>
          {updatedDate !== creationDate && (
            <small className="flex items-center text-[12px]">
              <FiEdit /> <span className="pl-1">{updatedDate}</span>
            </small>
          )}

          <button data-testid="entryCard-edit-button" onClick={(e) => contextMenuHandler(e)}>
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
              className="btn h-[30%] w-[100%] items-center justify-center"
              onClick={(e) => deleteEntryHandler(e, id)}
            >
              <FaRegTrashAlt />
              <span className="ml-1 font-semibold">Delete item</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryCard;
