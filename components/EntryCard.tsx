'use client';

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
    <div className="card bg-white text-primary-content shadow-md">
      <div className="card-body">
        <div style={{ backgroundColor: color }} className="ml-auto h-2 w-2 rounded"></div>
        <h2 className="card-title">{getExcerpt(content)}</h2>
        <small>Created: {creationDate}</small>
        {updatedDate !== creationDate && <small>Updated: {updatedDate}</small>}
      </div>
    </div>
  );
};
export default EntryCard;
