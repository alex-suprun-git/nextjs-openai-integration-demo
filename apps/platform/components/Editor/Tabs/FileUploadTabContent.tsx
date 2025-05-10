'use client';

import React, { ChangeEvent, useRef } from 'react';
import { FiUploadCloud, FiXCircle } from 'react-icons/fi';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { AlertMessages } from './AlertMessages';

interface FileUploadTabContentProps {
  isLoading: boolean;
  isNewEntry: boolean;
  t: (key: string) => string;
  onFileSelectionChange: (isSelected: boolean) => void;
  onFileSubmit: (content: string) => void;
}

interface FileDropzoneProps {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

interface FileInfoPanelProps {
  fileName: string;
  onRemove: () => void;
  t: (key: string) => string;
}

interface FilePreviewProps {
  content: string;
  t: (key: string) => string;
}

interface SubmitButtonProps {
  isDisabled: boolean;
  onClick: () => void;
  t: (key: string) => string;
}

function FileUploadTabContent({
  isLoading,
  isNewEntry,
  t,
  onFileSelectionChange,
  onFileSubmit,
}: FileUploadTabContentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedFile,
    filePreviewContent,
    fileReadError,
    isContentValid,
    isContentTooShort,
    processFile,
    resetFileSelection,
  } = useFileProcessor(t);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0] || null;

    // Reset input value immediately to allow re-selecting the same file
    if (fileInput) fileInput.value = '';

    const result = await processFile(file);
    onFileSelectionChange(result);
  };

  const handleRemoveFile = () => {
    resetFileSelection();
    onFileSelectionChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitFile = () => {
    if (!isContentValid || !filePreviewContent) return;
    onFileSubmit(filePreviewContent);
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <AlertMessages
        isContentTooShort={isContentTooShort || false}
        fileReadError={fileReadError}
        t={t}
      />

      {!selectedFile ? (
        <FileDropzone
          onFileChange={handleFileChange}
          t={t}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        />
      ) : (
        <FileInfoPanel fileName={selectedFile.name} onRemove={handleRemoveFile} t={t} />
      )}

      {filePreviewContent && <FilePreview content={filePreviewContent} t={t} />}

      {isNewEntry && isContentValid && (
        <SubmitButton isDisabled={isLoading} onClick={handleSubmitFile} t={t} />
      )}
    </div>
  );
}

function FileDropzone({ onFileChange, t, fileInputRef }: FileDropzoneProps) {
  return (
    <label
      htmlFor="dropzone-file-inner"
      className="flex min-h-80 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-900 hover:border-gray-500 hover:bg-gray-800 sm:min-h-[500px]"
    >
      <div className="flex flex-col items-center justify-center px-2 pb-6 pt-5">
        <FiUploadCloud className="mb-4 h-10 w-10 text-gray-400" />
        <p className="mb-2 text-sm text-gray-400">
          <span className="font-semibold">{t('dropzone.promptMain')}</span>
        </p>
        <p className="text-xs text-gray-500">{t('dropzone.promptDetails')}</p>
      </div>
      <input
        id="dropzone-file-inner"
        type="file"
        className="hidden"
        accept=".txt,.docx"
        onChange={onFileChange}
        ref={fileInputRef}
      />
    </label>
  );
}

function FileInfoPanel({ fileName, onRemove, t }: FileInfoPanelProps) {
  return (
    <div className="rounded-md p-4 text-center">
      <p className="mb-2 text-lg text-gray-300">{t('labels.selectedFilePrompt')}</p>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-xl font-semibold text-white">{fileName}</span>
        <button
          onClick={onRemove}
          className="btn btn-ghost btn-sm text-red-500 hover:text-red-400"
          aria-label={t('buttons.removeSelectedFile')}
        >
          <FiXCircle size={20} />
        </button>
      </div>
    </div>
  );
}

function FilePreview({ content, t }: FilePreviewProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="file-preview-area-inner"
        className="mb-1 block text-sm font-medium text-gray-300"
      >
        {t('labels.previewArea')}
      </label>
      <textarea
        id="file-preview-area-inner"
        readOnly
        value={content}
        className="textarea min-h-60 w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-4 text-base text-gray-300 outline-none disabled:text-stone-300"
        placeholder={t('labels.filePreviewPlaceholder')}
        disabled
      />
    </div>
  );
}

function SubmitButton({ isDisabled, onClick, t }: SubmitButtonProps) {
  return (
    <div className="mt-2 flex justify-end">
      <button
        id="GA_submitFileButton_inner"
        disabled={isDisabled}
        onClick={onClick}
        className="btn bg-yellow-200 text-gray-900 hover:bg-yellow-300"
      >
        {t('buttons.submitPreviewForAnalysis')}
      </button>
    </div>
  );
}

export default FileUploadTabContent;
