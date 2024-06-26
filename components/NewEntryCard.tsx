'use client';

import { createNewEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

const NewEntryCard: FC<{}> = () => {
  const router = useRouter();

  const handleOnClick = async () => {
    const entryData = await createNewEntry();
    router.push(`/journal/${entryData.id}`);
  };

  return (
    <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6" onClick={handleOnClick}>
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  );
};
export default NewEntryCard;
