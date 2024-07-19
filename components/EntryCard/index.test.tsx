import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createTranslator, useTranslations } from 'next-intl';
import EntryCard from '.';
import { formatDate, getExcerpt } from '@/utils/helpers';
import { deleteEntry } from '@/utils/api';

vi.mock('@/utils/helpers', () => ({
  formatDate: vi.fn(),
  getExcerpt: vi.fn(),
}));

vi.mock('@/utils/api', () => ({
  deleteEntry: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('EntryCard', () => {
  const mockRouterPush = vi.fn();
  const mockRouterRefresh = vi.fn();

  const mockEntry = {
    id: '1',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
    content: 'This is a test entry',
    color: '#ff0000',
  };

  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'JournalList',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (formatDate as Mock).mockImplementation((date: Date) => date.toISOString().split('T')[0]);
    (getExcerpt as Mock).mockImplementation((content: string) => content.slice(0, 100));
    (useRouter as Mock).mockReturnValue({
      push: mockRouterPush,
      refresh: mockRouterRefresh,
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<EntryCard {...mockEntry} />);
    expect(container).toMatchSnapshot();
  });

  it('renders with correct text and date', () => {
    render(<EntryCard {...mockEntry} />);
    expect(screen.getByText('This is a test entry')).toBeInTheDocument();
    expect(screen.getByText('2023-01-01')).toBeInTheDocument();
    expect(screen.getByText('2023-01-02')).toBeInTheDocument();
  });

  it('opens and closes context menu on right click and outside click', async () => {
    render(<EntryCard {...mockEntry} />);

    fireEvent.contextMenu(screen.getByText('This is a test entry'));
    expect(screen.getByText('Delete this memo')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText('Delete this memo')).not.toBeInTheDocument();
    });
  });

  it('calls deleteEntry and router.push on delete click', async () => {
    (deleteEntry as Mock).mockResolvedValueOnce({});
    render(<EntryCard {...mockEntry} />);

    fireEvent.contextMenu(screen.getByText('This is a test entry'));
    fireEvent.click(screen.getByText('Delete this memo'));

    await waitFor(() => {
      expect(deleteEntry).toHaveBeenCalledWith(mockEntry.id);
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/journal');
    });

    await waitFor(() => {
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });
});
