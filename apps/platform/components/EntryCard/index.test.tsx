import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import EntryCard from '../EntryCard';
import { formatDate } from '@/utils/helpers';
import { deleteEntry } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale, IntlProvider } from 'next-intl';

vi.mock('@/utils/helpers', () => ({
  formatDate: vi.fn(),
}));
vi.mock('@/utils/api', () => ({
  deleteEntry: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));
vi.mock('next-intl', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    useTranslations: vi.fn(),
    useLocale: vi.fn(),
    IntlProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('EntryCard', () => {
  const mockRouterPush = vi.fn();
  const mockRouterRefresh = vi.fn();

  const mockEntry = {
    id: '1',
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-01-02T00:00:00Z'),
    title: 'This is a test entry',
    color: '#ff0000',
  };

  const mockTranslations: { [key: string]: string } = {
    'JournalList.card.openContextMenu': 'Open context menu',
    'Global.deleteEntry.actionButton': 'Delete this memo',
    'Global.deleteEntry.confirmationMessage': 'Are you sure you want to delete this memo?',
    'Global.deleteEntry.cancelButton': 'Cancel',
    'Global.deleteEntry.confirmButton': 'Delete',
  };

  beforeEach(async () => {
    (useTranslations as Mock).mockImplementation((prefix: string) => {
      return (key: string) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        return mockTranslations[fullKey] || key;
      };
    });
    (useLocale as Mock).mockReturnValue('en');
    (formatDate as Mock).mockImplementation((date: Date) => date.toISOString().split('T')[0]);
    (useRouter as Mock).mockReturnValue({
      push: mockRouterPush,
      refresh: mockRouterRefresh,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) =>
    render(
      <IntlProvider locale="en" messages={{}}>
        {component}
      </IntlProvider>,
    );

  it('renders correctly and matches snapshot', () => {
    const { container } = renderWithProvider(<EntryCard {...mockEntry} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with correct text and date', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);
    let titles = screen.getAllByText('This is a test entry');
    titles.forEach((title) => {
      expect(title).toBeInTheDocument();
    });

    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });

  it('opens dropdown menu when clicking the three dots button', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Find the three dots button and click
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Check that the menu opened (action sheet in the component)
    const actionSheet = document.getElementById(`action-sheet-${mockEntry.id}`);
    expect(actionSheet).toBeInTheDocument();
    expect(actionSheet).toHaveAttribute('open');
    expect(screen.getByText('Delete this memo')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Open the dropdown menu
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Check that the menu opened
    const actionSheet = document.getElementById(`action-sheet-${mockEntry.id}`);
    expect(actionSheet).toBeInTheDocument();
    expect(actionSheet).toHaveAttribute('open');

    // Click the backdrop to close
    const backdrop = screen.getByText('close');
    fireEvent.click(backdrop);

    // Verify it's closed
    await waitFor(() => {
      expect(actionSheet).not.toHaveAttribute('open');
    });
  });

  it('opens modal when clicking delete in the dropdown', () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Open the dropdown menu
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Find and click the delete button
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Check that the modal window opened
    expect(screen.getByTestId('delete-entry-modal')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this memo?')).toBeInTheDocument();
    expect(screen.getByTestId('delete-cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-confirm-button')).toBeInTheDocument();
  });

  it('closes modal when clicking cancel button', async () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Open the dropdown menu and then the modal window
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Check that the modal window opened
    expect(screen.getByTestId('delete-entry-modal')).toBeInTheDocument();

    // Find and click the Cancel button
    const cancelButton = screen.getByTestId('delete-cancel-button');
    fireEvent.click(cancelButton);

    // Check that the modal window closed
    await waitFor(() => {
      expect(screen.queryByTestId('delete-entry-modal')).not.toBeInTheDocument();
    });
  });

  it('calls deleteEntry and router.push when confirming deletion in modal', async () => {
    (deleteEntry as Mock).mockResolvedValueOnce({});
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Open the dropdown menu and then the modal window
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Check that the modal window opened
    expect(screen.getByTestId('delete-entry-modal')).toBeInTheDocument();

    // Click the Delete button in the modal window
    const confirmDeleteButton = screen.getByTestId('delete-confirm-button');
    fireEvent.click(confirmDeleteButton);

    // Check that the necessary functions were called
    await waitFor(() => {
      expect(deleteEntry).toHaveBeenCalledWith(mockEntry.id);
      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it('closes dropdown and modal when pressing Escape key', async () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    // Open the dropdown menu
    const dotsButton = screen.getByTestId('entryCard-edit-button');
    fireEvent.click(dotsButton);

    // Check that the menu opened
    const actionSheet = document.getElementById(`action-sheet-${mockEntry.id}`);
    expect(actionSheet).toBeInTheDocument();
    expect(actionSheet).toHaveAttribute('open');

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Check that the dropdown closed
    await waitFor(() => {
      expect(actionSheet).not.toHaveAttribute('open');
    });

    // Open the dropdown menu and then the modal window
    fireEvent.click(dotsButton);
    const deleteButton = screen.getByTestId('entryCard-delete-button');
    fireEvent.click(deleteButton);

    // Check that the modal window opened
    expect(screen.getByTestId('delete-entry-modal')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Check that the modal window closed
    await waitFor(() => {
      expect(screen.queryByTestId('delete-entry-modal')).not.toBeInTheDocument();
    });
  });
});
