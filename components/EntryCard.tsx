'use client';

import { IoDocumentTextOutline } from 'react-icons/io5';
import { FiEdit } from 'react-icons/fi';
import { formatDate, getExcerpt } from '@/utils/helpers';

type EntryCardProps = {
  createdAt: Date;
  updatedAt: Date;
  content: string;
  color: string;
};

const EntryCard = ({ createdAt, updatedAt, content, color }: EntryCardProps) => {
  const creationDate = formatDate(createdAt);
  const updatedDate = formatDate(updatedAt);

  return (
    <div className="card relative bg-white text-primary-content shadow-md">
      <div className="card-body">
        <div
          style={{ backgroundColor: color }}
          className="absolute right-4 top-4 ml-auto h-2 w-2 rounded"
        ></div>
        <h2 className="card-title">{getExcerpt(content)}</h2>
        <div className="flex justify-between">
          <small className="flex items-center text-[12px]">
            <IoDocumentTextOutline /> <span className="pl-1">{creationDate}</span>
          </small>
          {updatedDate !== creationDate && (
            <small className="flex items-center text-[12px]">
              <FiEdit /> <span className="pl-1">{updatedDate}</span>
            </small>
          )}
        </div>
      </div>
    </div>
  );
};
export default EntryCard;
