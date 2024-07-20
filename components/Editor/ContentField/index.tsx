'use client';

import { MutableRefObject } from 'react';
import { useTranslations } from 'next-intl';
import { Alert, Loading } from '@/ui-lib';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

function Content({
  isLoading,
  isContentEntryUpdated,
  contentValue,
  contentChangeHandler,
  entryCreatedRef,
  isPromptSymbolsExceeded,
}: {
  isLoading: boolean;
  isContentEntryUpdated: boolean;
  contentValue: string;
  contentChangeHandler: Function;
  entryCreatedRef: MutableRefObject<boolean>;
  isPromptSymbolsExceeded: boolean;
}) {
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
      {isLoading && <Loading customClasses="absolute inset-x-2/4 inset-y-2/4" />}
      <textarea
        data-testid="entry-content-field"
        className="textarea min-h-72 w-full resize-none p-10 text-xl outline-none md:max-lg:h-[80%] lg:min-h-svh"
        value={contentValue}
        onChange={(e) => contentChangeHandler(e)}
        placeholder={t('contentFieldPlaceholder')}
        maxLength={2500}
        disabled={isPromptSymbolsExceeded || isLoading}
        required
      />
    </>
  );
}

export default Content;
