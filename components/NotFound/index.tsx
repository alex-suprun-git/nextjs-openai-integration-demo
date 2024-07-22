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
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-stone-300">
            {t('description1')}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {t('description2')}
          </p>
          <Link
            href={link}
            className="focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-stone-300 hover:bg-blue-800 focus:outline-none focus:ring-4"
          >
            {t('linkText')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
