'use client';

import clsx from 'clsx';
import React, { MouseEventHandler, useState } from 'react';
import { Loading } from '@repo/global-ui';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';
import FileUploadTabContent from './FileUploadTabContent';
import { AlertMessages } from './AlertMessages';

interface TabRadioButtonProps {
  active: boolean;
  disabled: boolean;
  onChange: () => void;
  label: string;
}

interface TextEditorPanelProps {
  contentValue: string;
  isNewEntry: boolean;
  isContentTooShort: boolean;
  isFileSelectedInUpload: boolean;
  isLoading: boolean;
  isPromptSymbolsExceeded: boolean;
  handleTextTabChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  saveContentHandler: MouseEventHandler<HTMLButtonElement>;
  t: (key: string) => string;
}

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
  changeContentHandler: (
    e: React.ChangeEvent<HTMLTextAreaElement> | { target: { value: string } },
  ) => void;
  saveContentHandler: MouseEventHandler<HTMLButtonElement>;
  isPromptSymbolsExceeded: boolean;
}) {
  const pathname = usePathname();
  const isNewEntry = pathname === '/new-entry';
  const t = useTranslations('Editor');

  const [isFileSelectedInUpload, setIsFileSelectedInUpload] = useState(false);
  const [uploadTabResetKey, setUploadTabResetKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'text' | 'upload'>('text');

  const handleFileSelectionStateChange = (isSelected: boolean) => {
    setIsFileSelectedInUpload(isSelected);
    if (isSelected) {
      changeContentHandler({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>);
      setActiveTab('upload');
    }
  };

  const handleFileContentSubmit = (fileContent: string) => {
    changeContentHandler({
      target: { value: fileContent },
    } as React.ChangeEvent<HTMLTextAreaElement>);
    saveContentHandler({} as React.MouseEvent<HTMLButtonElement>);
    setIsFileSelectedInUpload(false);
    setUploadTabResetKey((prev) => prev + 1);
    setActiveTab('text');
  };

  const handleTextTabChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeContentHandler(e);
    if (isFileSelectedInUpload) {
      setIsFileSelectedInUpload(false);
    }
    if (activeTab !== 'text') {
      setActiveTab('text');
    }
  };

  const isTextContentInTextTab = contentValue.length > 0;
  const isContentTooShort = contentValue.length < MINIMUM_CONTENT_LENGTH;

  return (
    <div className="tabs tabs-lift tabs-lg mb-6 p-6">
      <TabRadioButton
        active={activeTab === 'text'}
        disabled={isFileSelectedInUpload}
        onChange={() => {
          if (!isFileSelectedInUpload) {
            setActiveTab('text');
          }
        }}
        label={t('tabs.textLabel')}
      />

      <div className="tab-content border-stone-900 bg-base-100 p-3 sm:p-6">
        <>
          <AlertMessages
            isPromptSymbolsExceeded={isPromptSymbolsExceeded}
            isContentTooShort={!isFileSelectedInUpload && isContentTooShort}
            isContentEntryCreated={!isFileSelectedInUpload && isContentEntryCreated}
            isContentEntryUpdated={!isFileSelectedInUpload && isContentEntryUpdated}
            t={t}
          />

          <TextEditorPanel
            contentValue={contentValue}
            isNewEntry={isNewEntry}
            isContentTooShort={isContentTooShort}
            isFileSelectedInUpload={isFileSelectedInUpload}
            isLoading={isLoading}
            isPromptSymbolsExceeded={isPromptSymbolsExceeded}
            handleTextTabChange={handleTextTabChange}
            saveContentHandler={saveContentHandler}
            t={t}
          />
        </>
      </div>

      <TabRadioButton
        active={activeTab === 'upload'}
        disabled={isTextContentInTextTab}
        onChange={() => {
          if (!isTextContentInTextTab) {
            setActiveTab('upload');
            changeContentHandler({
              target: { value: '' },
            } as React.ChangeEvent<HTMLTextAreaElement>);
            setUploadTabResetKey((prev) => prev + 1);
          }
        }}
        label={t('tabs.uploadFileLabel')}
      />

      <div className="tab-content border-base-300 bg-base-100 p-3 sm:p-6">
        <FileUploadTabContent
          key={uploadTabResetKey}
          isLoading={isLoading}
          isNewEntry={isNewEntry}
          t={t}
          onFileSelectionChange={handleFileSelectionStateChange}
          onFileSubmit={handleFileContentSubmit}
        />
      </div>
    </div>
  );
}

// Extracted sub-components
function TabRadioButton({ active, disabled, onChange, label }: TabRadioButtonProps) {
  return (
    <input
      type="radio"
      name="contentFieldTabs"
      className="tab bg-transparent [--tab-bg:#1d232a]"
      aria-label={label}
      checked={active}
      disabled={disabled}
      onChange={onChange}
      readOnly
    />
  );
}

function TextEditorPanel({
  contentValue,
  isNewEntry,
  isContentTooShort,
  isFileSelectedInUpload,
  isLoading,
  isPromptSymbolsExceeded,
  handleTextTabChange,
  saveContentHandler,
  t,
}: TextEditorPanelProps) {
  return (
    <>
      <div className="relative">
        {isLoading && (
          <Loading customClasses="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
        <textarea
          data-testid="entry-content-field"
          className={clsx(
            'textarea min-h-80 w-full resize-none bg-gray-900 p-10 text-xl outline-none disabled:bg-gray-900 disabled:text-gray-300',
            !isNewEntry && 'sm:min-h-[500px]',
            isFileSelectedInUpload && 'cursor-not-allowed opacity-50',
            isContentTooShort && 'mt-6',
          )}
          value={contentValue}
          onChange={handleTextTabChange}
          placeholder={t('contentFieldPlaceholder')}
          maxLength={500}
          disabled={isPromptSymbolsExceeded || isLoading || !isNewEntry || isFileSelectedInUpload}
          required
        />
      </div>
      {isNewEntry && !isFileSelectedInUpload && (
        <div className="mt-6 flex justify-end">
          <button
            id="GA_createRecordButton"
            disabled={contentValue.length < MINIMUM_CONTENT_LENGTH || isLoading}
            onClick={saveContentHandler}
            className="btn bg-yellow-200 text-gray-900 hover:bg-yellow-300"
          >
            {t('buttons.submitTextEntry')}
          </button>
        </div>
      )}
    </>
  );
}

export default Tabs;
