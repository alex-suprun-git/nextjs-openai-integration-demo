import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { createTranslator, useTranslations } from 'next-intl';
import AnalysisSidebar from '.';
import { deleteEntry } from '@/utils/api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReactNode } from 'react';

// Mock the dependencies
vi.mock('@/utils/api', () => ({
  deleteEntry: vi.fn(),
}));

vi.mock('next/dist/shared/lib/app-router-context.shared-runtime', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/utils/helpers', () => ({
  convertHexToRGBA: vi.fn().mockReturnValue('rgba(0, 0, 0, 0.25)'),
  getMoodImage: vi.fn().mockReturnValue('url(/path/to/image.jpg)'),
}));

// Mock useTranslations for both Editor and Global namespaces
vi.mock('next-intl', async () => {
  const actual = await vi.importActual('next-intl');
  return {
    ...actual,
    useTranslations: vi.fn((namespace) => {
      if (namespace === 'Editor') {
        return (key: string) => {
          const keys: { [key: string]: string } = {
            'analysis.headline': 'Analysis',
            'analysis.labels.summary': 'Summary',
            'analysis.labels.subject': 'Subject',
            'analysis.labels.mood': 'Mood',
            'analysis.labels.negative': 'Negative',
          };
          return keys[key] || key;
        };
      } else if (namespace === 'Global') {
        return (key: string) => {
          const keys: { [key: string]: string } = {
            'deleteEntry.actionButton': 'Delete this memo',
            'deleteEntry.confirmButton': 'Delete',
            'deleteEntry.cancelButton': 'Cancel',
            'deleteEntry.confirmationMessage': 'Are you sure you want to delete this memo?',
          };
          return keys[key] || key;
        };
      }
      return (key: string) => key;
    }),
  };
});

// Mock Modal component
vi.mock('@/components/Modal', () => ({
  default: ({
    isOpen,
    confirmButton,
    onClose,
    cancelButton,
    children,
    title,
    testId,
  }: {
    isOpen: boolean;
    confirmButton: {
      testId: string;
      onClick: () => void;
      label: string;
    };
    onClose: (e: any) => void;
    cancelButton?: {
      label: string;
      testId: string;
    };
    title: string;
    children: ReactNode;
    testId?: string;
  }) =>
    isOpen ? (
      <div data-testid={testId || 'mock-modal'}>
        <div>{title}</div>
        <div>{children}</div>
        <button data-testid={confirmButton.testId} onClick={confirmButton.onClick}>
          {confirmButton.label}
        </button>
        {cancelButton && (
          <button data-testid={cancelButton.testId} onClick={onClose}>
            {cancelButton.label}
          </button>
        )}
      </div>
    ) : null,
}));

describe('AnalysisSidebar', () => {
  const mockRouter = {
    push: vi.fn(),
    refresh: vi.fn(),
  } as unknown as AppRouterInstance;

  const mockAnalysis = {
    summary: 'Test Summary',
    subject: 'Test Subject',
    mood: 'Happy',
    color: 'green',
    negative: false,
    sentimentScore: 8,
    title: 'Test Summary',
  };

  const mockEntryId = '12345';

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders analysis data correctly', () => {
    render(<AnalysisSidebar analysis={mockAnalysis} router={mockRouter} />);

    expect(screen.getByText('Summary:')).toBeInTheDocument();
    expect(screen.getByText('Test Summary')).toBeInTheDocument();
    expect(screen.getByText('Subject:')).toBeInTheDocument();
    expect(screen.getByText('Test Subject')).toBeInTheDocument();
    expect(screen.getByText('Mood:')).toBeInTheDocument();
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Negative:')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('opens confirmation modal when delete button is clicked', () => {
    render(<AnalysisSidebar entryId={mockEntryId} analysis={mockAnalysis} router={mockRouter} />);

    const deleteButton = screen.getByTestId('delete-entry-button');
    fireEvent.click(deleteButton);

    expect(screen.getByTestId('delete-entry-modal')).toBeInTheDocument();
  });

  it('calls deleteEntryHandler when delete is confirmed in modal', async () => {
    render(<AnalysisSidebar entryId={mockEntryId} analysis={mockAnalysis} router={mockRouter} />);

    // Open the modal
    const deleteButton = screen.getByTestId('delete-entry-button');
    fireEvent.click(deleteButton);

    // Confirm deletion in the modal
    const confirmButton = screen.getByTestId('delete-entry-confirm-button');
    fireEvent.click(confirmButton);

    expect(deleteEntry).toHaveBeenCalledWith(mockEntryId);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
