import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from './index';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        Test Content
      </Modal>,
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Test Content
      </Modal>,
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should call onClose when clicking the cancel button', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        cancelButton={{ label: 'Cancel', testId: 'cancel-btn' }}
      >
        Test Content
      </Modal>,
    );

    const cancelButton = screen.getByTestId('cancel-btn');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call confirmButton.onClick when clicking the confirm button', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        confirmButton={{
          label: 'Confirm',
          onClick: mockOnConfirm,
          testId: 'confirm-btn',
        }}
      >
        Test Content
      </Modal>,
    );

    const confirmButton = screen.getByTestId('confirm-btn');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should close when clicking on the modal backdrop', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Test Content
      </Modal>,
    );

    const modalBackdrop = screen.getByTestId('modal');
    fireEvent.click(modalBackdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close when clicking on the modal content', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Test Content
      </Modal>,
    );

    const modalContent = screen.getByText('Test Content');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should close when pressing Escape key', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        Test Content
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should apply custom class names', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        className="custom-class"
        testId="custom-modal"
      >
        Test Content
      </Modal>,
    );

    const modalElement = screen.getByTestId('custom-modal');
    const modalBox = modalElement.querySelector('.modal-box');

    expect(modalBox).toHaveClass('custom-class');
  });

  it('should apply custom button class names', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Modal"
        cancelButton={{ label: 'Cancel', className: 'custom-cancel-class', testId: 'cancel-btn' }}
        confirmButton={{
          label: 'Confirm',
          onClick: mockOnConfirm,
          className: 'custom-confirm-class',
          testId: 'confirm-btn',
        }}
      >
        Test Content
      </Modal>,
    );

    const cancelButton = screen.getByTestId('cancel-btn');
    const confirmButton = screen.getByTestId('confirm-btn');

    expect(cancelButton).toHaveClass('custom-cancel-class');
    expect(confirmButton).toHaveClass('custom-confirm-class');
  });
});
