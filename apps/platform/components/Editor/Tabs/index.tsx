'use client';

import clsx from 'clsx';
import React, { MouseEventHandler, RefObject } from 'react';
import { Alert, Loading } from '@repo/global-ui';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

function Tabs({
  isLoading,
  isContentEntryUpdated,
  isContentEntryCreated,
  contentValue,
  changeContentHandler,
  saveContentHandler,
  isPromptSymbolsExceeded,
}: {
  isLoading: boolean;
  isContentEntryUpdated: boolean;
  isContentEntryCreated: boolean;
  contentValue: string;
  changeContentHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  saveContentHandler: MouseEventHandler<HTMLButtonElement>;
  isPromptSymbolsExceeded: boolean;
}) {
  const pathname = usePathname();
  const isNewEntry = pathname === '/new-entry';
  const isContentTooShort = contentValue.length < MINIMUM_CONTENT_LENGTH;
  const t = useTranslations('Editor');

  return (
    <div className="tabs tabs-lift tabs-lg mb-6 p-6">
      <input
        type="radio"
        name="contentFieldTabs"
        className="tab"
        aria-label="Text"
        defaultChecked
      />
      <div className="tab-content border-stone-900 p-3 sm:p-6">
        <>
          {isPromptSymbolsExceeded && (
            <Alert type="error">{t('alerts.symbolsLimitExceeded')}</Alert>
          )}
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
      </div>

      <input type="radio" name="contentFieldTabs" className="tab" aria-label="Upload File" />
      <div className="tab-content border-stone-900 p-3 sm:p-6">Tab content 2</div>
    </div>
  );
}

export default Tabs;
