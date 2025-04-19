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

  beforeEach(async () => {
    const { createTranslator } = await import('next-intl');
    const translate = createTranslator({
      locale: 'en',
      namespace: 'JournalList',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
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
    expect(screen.getByText('This is a test entry')).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
    expect(screen.getByText('2025-01-02')).toBeInTheDocument();
  });

  it('opens and closes context menu on right click and outside click', async () => {
    renderWithProvider(<EntryCard {...mockEntry} />);

    fireEvent.contextMenu(screen.getByText('This is a test entry'));
    expect(screen.getByText('Delete this memo')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Delete this memo')).not.toBeInTheDocument();
    });
  });

  it('calls deleteEntry and router.push on delete click', async () => {
    (deleteEntry as Mock).mockResolvedValueOnce({});
    renderWithProvider(<EntryCard {...mockEntry} />);

    fireEvent.contextMenu(screen.getByText('This is a test entry'));
    fireEvent.click(screen.getByText('Delete this memo'));

    await waitFor(() => {
      expect(deleteEntry).toHaveBeenCalledWith(mockEntry.id);
      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });
});
