'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/ui-lib';

const NewEntryCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOnClick = async () => {
    setIsLoading(true);
    router.push('/journal/new-entry');
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loading fullscreen />}
      <div
        onClick={handleOnClick}
        className="card cursor-pointer bg-yellow-200 text-primary-content"
      >
        <div className="card-body">
          <span data-testid="new-entry-button" className="text-2xl font-bold text-gray-900">
            Write a new memo
          </span>
        </div>
      </div>
    </>
  );
};
export default NewEntryCard;
