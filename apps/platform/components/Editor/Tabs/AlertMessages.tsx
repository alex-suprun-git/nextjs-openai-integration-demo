'use client';

import { Alert } from '@repo/global-ui';
import React from 'react';

interface AlertMessagesProps {
  isPromptSymbolsExceeded?: boolean;
  isContentTooShort?: boolean;
  isContentEntryCreated?: boolean;
  isContentEntryUpdated?: boolean;
  fileReadError?: string | null;
  t: (key: string) => string;
}

export function AlertMessages({
  isPromptSymbolsExceeded,
  isContentTooShort,
  isContentEntryCreated,
  isContentEntryUpdated,
  fileReadError,
  t,
}: AlertMessagesProps) {
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
      {fileReadError && (
        <Alert type={fileReadError === t('alerts.filePreviewReady') ? 'success' : 'error'}>
          {fileReadError}
        </Alert>
      )}
    </>
  );
}
