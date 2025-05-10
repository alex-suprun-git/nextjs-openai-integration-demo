'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const NotFound = ({ link, homepage }: { link: string; homepage?: boolean }) => {
  const namespace = homepage ? 'E404Homepage' : 'E404JournalEntry';
  const t = useTranslations(namespace);

  return (
    <section className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-red-500 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-100 md:text-4xl">
            {t('description1')}
          </p>
          <p className="mb-4 text-lg font-light text-gray-100">{t('description2')}</p>
          <Link href={link} className="btn bg-yellow-200 text-gray-900 hover:bg-yellow-300">
            {t('linkText')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
