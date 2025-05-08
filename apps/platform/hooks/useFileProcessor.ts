import { useState } from 'react';
import DOMPurify from 'dompurify';
import mammoth from 'mammoth';
import { MAX_FILE_SIZE_BYTES } from '@/constants';
import { MINIMUM_CONTENT_LENGTH } from '@/utils/constants';

const DOCX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function useFileProcessor(t: (key: string) => string) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewContent, setFilePreviewContent] = useState<string | null>(null);
  const [fileReadError, setFileReadError] = useState<string | null>(null);

  const processFile = async (file: File | null) => {
    setFileReadError(null);
    setFilePreviewContent(null);

    if (!file) {
      setSelectedFile(null);
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileReadError(t('alerts.fileTooLarge'));
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);

    try {
      if (file.type === 'text/plain') {
        await processTextFile(file);
      } else if (file.type === DOCX_MIME_TYPE) {
        await processDocxFile(file);
      } else {
        setFileReadError(t('alerts.fileTypeNoPreview'));
        setFilePreviewContent(null);
      }
      return true;
    } catch (error) {
      console.error('File processing error:', error);
      setFileReadError(error instanceof Error ? error.message : t('alerts.fileReadError'));
      setSelectedFile(null);
      setFilePreviewContent(null);
      return false;
    }
  };

  const processTextFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        const sanitizedText = DOMPurify.sanitize(text, { USE_PROFILES: { html: false } });
        setFilePreviewContent(sanitizedText);
        setFileReadError(t('alerts.filePreviewReady'));
        resolve();
      };
      reader.onerror = () => reject(new Error(t('alerts.fileReadError')));
      reader.readAsText(file);
    });
  };

  const processDocxFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) throw new Error('Failed to read file buffer.');

          const result = await mammoth.extractRawText({ arrayBuffer });
          const rawText = result.value || '';
          const sanitizedText = DOMPurify.sanitize(rawText, { USE_PROFILES: { html: false } });
          setFilePreviewContent(sanitizedText);
          setFileReadError(t('alerts.filePreviewReady'));
          resolve();
        } catch (mammothError) {
          console.error('Mammoth extraction error:', mammothError);
          setFileReadError(t('alerts.fileReadError'));
          setSelectedFile(null);
          setFilePreviewContent(null);
          reject(mammothError);
        }
      };
      reader.onerror = () => reject(new Error(t('alerts.fileReadError')));
      reader.readAsArrayBuffer(file);
    });
  };

  const resetFileSelection = () => {
    setSelectedFile(null);
    setFilePreviewContent(null);
    setFileReadError(null);
  };

  const isContentValid = filePreviewContent && filePreviewContent.length >= MINIMUM_CONTENT_LENGTH;
  const isContentTooShort =
    filePreviewContent && filePreviewContent.length < MINIMUM_CONTENT_LENGTH;

  return {
    selectedFile,
    filePreviewContent,
    fileReadError,
    isContentValid,
    isContentTooShort,
    processFile,
    resetFileSelection,
  };
}
