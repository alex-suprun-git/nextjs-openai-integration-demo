'use client';

import { MouseEventHandler, RefObject } from 'react';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Alert, Loading } from '@repo/global-ui';
import { usePathname } from 'next/navigation';
import Tabs from '../Tabs';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

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
  changeContentHandler: (
    e: React.ChangeEvent<HTMLTextAreaElement> | { target: { value: string } },
  ) => void;
  saveContentHandler: MouseEventHandler<HTMLButtonElement>;
  entryCreatedRef: RefObject<boolean>;
  isPromptSymbolsExceeded: boolean;
}) {
  const pathname = usePathname();
  const isNewEntry = pathname === '/new-entry';
  const isContentEntryCreated = entryCreatedRef.current;

  const t = useTranslations('Editor');

  return (
    <>
      {isNewEntry ? (
        <Tabs
          isLoading={isLoading}
          isContentEntryUpdated={isContentEntryUpdated}
          isContentEntryCreated={isContentEntryCreated}
          contentValue={contentValue}
          changeContentHandler={changeContentHandler}
          saveContentHandler={saveContentHandler}
          isPromptSymbolsExceeded={isPromptSymbolsExceeded}
        />
      ) : (
        <div className="px-6">
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
              placeholder={t('contentFieldPlaceholder')}
              disabled={true}
              required
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Content;
