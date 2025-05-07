'use client';

import clsx from 'clsx';
import { MouseEventHandler, RefObject } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Loading } from '@repo/global-ui';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';
import { usePathname } from 'next/navigation';

function Content({
  isLoading,
  isContentEntryUpdated,
  contentValue,
  changeContentHandler,
  saveContentHandler,
  entryCreatedRef,
  isPromptSymbolsExceeded,
}: {
  isLoading: boolean;
  isContentEntryUpdated: boolean;
  contentValue: string;
  changeContentHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  saveContentHandler: MouseEventHandler<HTMLButtonElement>;
  entryCreatedRef: RefObject<boolean>;
  isPromptSymbolsExceeded: boolean;
}) {
  const pathname = usePathname();
  const isNewEntry = pathname === '/new-entry';
  const isContentTooShort = contentValue.length < MINIMUM_CONTENT_LENGTH;
  const isContentEntryCreated = entryCreatedRef.current;

  const t = useTranslations('Editor');

  return (
    <>
      {isPromptSymbolsExceeded && <Alert type="error">{t('alerts.symbolsLimitExceeded')}</Alert>}
      {!isPromptSymbolsExceeded && isContentTooShort && (
        <Alert type="warning" testId="alert-content-too-short">
          {t('alerts.contentTooShort')}
        </Alert>
      )}
      {isContentEntryCreated && <Alert type="success">{t('alerts.entryCreated')}</Alert>}
      {isContentEntryUpdated && <Alert type="success">{t('alerts.entryUpdated')}</Alert>}
      <div className="relative">
        {isLoading && (
          <Loading customClasses="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        <textarea
          data-testid="entry-content-field"
          className={clsx(
            'textarea min-h-80 w-full resize-none bg-gray-900 p-10 text-xl outline-none disabled:bg-gray-900 disabled:text-gray-300',
            !isNewEntry && 'sm:min-h-[500px]',
          )}
          value={contentValue}
          onChange={(e) => changeContentHandler(e)}
          placeholder={t('contentFieldPlaceholder')}
          maxLength={500}
          disabled={isPromptSymbolsExceeded || isLoading || !isNewEntry}
          required
        />
      </div>
      {isNewEntry && (
        <div className="mt-6 flex justify-end">
          <button
            id="GA_createRecordButton"
            disabled={!!isContentTooShort || isLoading}
            onClick={saveContentHandler}
            className="btn bg-blue-900"
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
}

export default Content;
