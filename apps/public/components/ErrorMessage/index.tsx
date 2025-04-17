'use client';

import React from 'react';
// import { useTranslations } from 'next-intl';

function ErrorMessage({ error, reset }: { error: Error; reset: () => void }) {
  // const namespace = 'ErrorBoundary';
  // const t = useTranslations(namespace);

  return (
    <section className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-10 text-6xl font-extrabold tracking-tight text-stone-300 lg:text-7xl">
            {/* {t('headline')} */}
          </h1>
          {error.message && (
            <p className="mb-12 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-stone-300">
              {error.message}
            </p>
          )}
          <button
            className="btn btn-lg mb-5 border-0 bg-yellow-200 px-10 text-gray-900 hover:bg-yellow-300"
            onClick={() => reset()}
          >
            {/* {t('buttons.tryAgain')} */}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ErrorMessage;
