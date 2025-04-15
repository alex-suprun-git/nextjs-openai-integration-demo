import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import JournalPage from '@/app/platform/journal/page';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { redirect } from 'next/navigation';
import { createTranslator, useTranslations } from 'next-intl';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    journalEntry: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('@/components/EntryCard', () => ({
  default: ({ id, content }: any) => (
    <div data-testid="entry-card" data-id={id}>
      {content}
    </div>
  ),
}));

vi.mock('@/components/NewEntryCard', () => ({
  default: () => <div data-testid="new-entry-card" />,
}));

vi.mock('@/components/Question', () => ({
  default: () => <div data-testid="question" />,
}));

vi.mock('@/ui-lib', () => ({
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

describe('JournalPage', () => {
  beforeEach(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'JournalList',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render correctly with entries', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    const mockEntries = [
      {
        id: 'entry-1',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        content: 'Entry 1 content',
        analysis: {
          color: 'blue',
        },
      },
      {
        id: 'entry-2',
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-04'),
        content: 'Entry 2 content',
        analysis: {
          color: 'red',
        },
      },
    ];
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.journalEntry.findMany as Mock).mockResolvedValue(mockEntries);

    // Act
    render(<div>{await JournalPage()}</div>);

    // Assert
    expect(await screen.findByText('Journal')).toBeInTheDocument();
    expect(await screen.findByTestId('question')).toBeInTheDocument();
    expect(await screen.findByTestId('new-entry-card')).toBeInTheDocument();
    expect(screen.getByText('Entry 1 content')).toBeInTheDocument();
    expect(screen.getByText('Entry 2 content')).toBeInTheDocument();
  });

  it('should render correctly with no entries', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.journalEntry.findMany as Mock).mockResolvedValue([]);

    // Act
    render(<div>{await JournalPage()}</div>);

    // Assert
    expect(await screen.findByText('Journal')).toBeInTheDocument();
    expect(screen.queryByTestId('question')).not.toBeInTheDocument();
    expect(await screen.findByTestId('new-entry-card')).toBeInTheDocument();
    expect(screen.queryByTestId('entry-card')).not.toBeInTheDocument();
  });

  it('should redirect if no user is found', async () => {
    // Arrange
    (getUserByClerkId as Mock).mockResolvedValue(null);

    // Act
    render(<div>{await JournalPage()}</div>);

    // Assert
    expect(redirect).toHaveBeenCalledWith('/');
  });
});
