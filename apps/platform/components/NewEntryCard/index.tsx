'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const NewEntryCard = () => {
  const router = useRouter();

  const t = useTranslations('JournalList');

  const handleOnClick = async () => {
    router.push('/new-entry');
  };

  return (
    <div
      onClick={handleOnClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOnClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={t('buttons.newEntry')}
      className="card h-[128px] cursor-pointer bg-yellow-200 text-primary-content"
    >
      <div className="card-body">
        <span data-testid="new-entry-button" className="min-h-20 text-2xl font-bold text-gray-900">
          {t('buttons.newEntry')}
        </span>
      </div>
    </div>
  );
};

export default NewEntryCard;
