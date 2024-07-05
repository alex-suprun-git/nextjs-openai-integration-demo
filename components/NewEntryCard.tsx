'use client';

import { useRouter } from 'next/navigation';

const NewEntryCard = () => {
  const router = useRouter();

  const handleOnClick = async () => {
    router.push('/journal/new-entry');
  };

  return (
    <div onClick={handleOnClick} className="card cursor-pointer bg-yellow-200 text-primary-content">
      <div className="card-body">
        <span className="text-2xl font-bold text-gray-900">Write a new memo</span>
      </div>
    </div>
  );
};
export default NewEntryCard;
