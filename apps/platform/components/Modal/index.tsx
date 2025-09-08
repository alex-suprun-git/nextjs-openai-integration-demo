'use client';

import { ReactNode } from 'react';
import useKeyPress from '@/hooks/useKeyPress';
import clsx from 'clsx';

type ModalProps = {
  isOpen: boolean;
  onClose: (e: React.MouseEvent) => void;
  title: string;
  children: ReactNode;
  confirmButton?: {
    label: string;
    onClick: (e: React.MouseEvent) => void;
    className?: string;
    testId?: string;
  };
  cancelButton?: {
    label: string;
    className?: string;
    testId?: string;
  };
  className?: string;
  testId?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmButton,
  cancelButton = {
    label: 'Cancel',
    className: '',
    testId: 'modal-cancel-button',
  },
  className = '',
  testId = 'modal',
}: ModalProps) => {
  const handlePreventPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useKeyPress(() => {
    if (isOpen && onClose) {
      onClose({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
    }
  }, ['Escape']);

  if (!isOpen) return null;

  return (
    <div
      className="modal-open modal cursor-default"
      onClick={onClose}
      data-testid={testId}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={clsx('modal-box relative border border-gray-200 bg-white', className)}
        onClick={handlePreventPropagation}
      >
        <h3 id="modal-title" className="text-lg font-bold text-gray-800">
          {title}
        </h3>
        <div className="py-4 text-gray-600">{children}</div>
        <div className="modal-action">
          <button
            className={clsx(
              'btn btn-outline border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none',
              cancelButton.className,
            )}
            onClick={onClose}
            data-testid={cancelButton.testId}
          >
            {cancelButton.label}
          </button>
          {confirmButton && (
            <button
              className={clsx(
                'btn border-0 focus:outline-none',
                confirmButton.className || 'bg-red-800 text-white hover:bg-red-900',
              )}
              onClick={confirmButton.onClick}
              data-testid={confirmButton.testId || 'modal-confirm-button'}
            >
              {confirmButton.label}
            </button>
          )}
        </div>
      </div>
      <button className="modal-backdrop" onClick={onClose} aria-label="Close modal"></button>
    </div>
  );
};

export default Modal;
