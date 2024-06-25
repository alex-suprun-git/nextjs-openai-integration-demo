import { FC } from 'react';

const NewEntryCard: FC<{}> = () => (
  <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow">
    <div className="px-4 py-5 sm:p-6">
      <span className="text-3xl">New Entry</span>
    </div>
  </div>
);
export default NewEntryCard;
