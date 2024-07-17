'use client';

import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Alert, Loading } from '@/ui-lib';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

function Content({
  isLoading,
  contentValue,
  setContentValue,
  entryCreatedRef,
  isPromptSymbolsExceeded,
}: {
  isLoading: boolean;
  contentValue: string;
  setContentValue: Dispatch<SetStateAction<string>>;
  entryCreatedRef: MutableRefObject<boolean>;
  isPromptSymbolsExceeded: boolean;
}) {
  const isContentTooShort = contentValue.length < MINIMUM_CONTENT_LENGTH;
  const isContentEntryCreated = entryCreatedRef.current;

  return (
    <>
      {isPromptSymbolsExceeded && (
        <Alert type="error">
          You have reached the 10,000 symbol limit and cannot make new requests.
        </Alert>
      )}
      {!isPromptSymbolsExceeded && isContentTooShort && (
        <Alert type="warning" testId="alert-content-too-short">
          Please enter at least 30 characters. Changes are not saved for entries with fewer than 30
          characters.
        </Alert>
      )}
      {isContentEntryCreated && (
        <Alert type="success">A new note was created. Redirecting....</Alert>
      )}
      {isLoading && <Loading customClasses="absolute inset-x-2/4 inset-y-2/4" />}
      <textarea
        data-testid="entry-content-field"
        className="textarea min-h-72 w-full resize-none p-10 text-xl outline-none md:max-lg:h-[80%] lg:min-h-svh"
        value={contentValue}
        onChange={(e) => {
          setContentValue((prevValue: string) =>
            e.target.value !== '' ? e.target.value : prevValue,
          );
        }}
        placeholder="Please write your thoughts here..."
        maxLength={2500}
        disabled={isPromptSymbolsExceeded || isLoading}
        required
      />
    </>
  );
}

export default Content;
