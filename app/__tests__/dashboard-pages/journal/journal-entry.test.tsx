import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import EntryPage from '@/app/platform/journal/[id]/page';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { notFound } from 'next/navigation';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    journalEntry: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@/components/Editor', () => ({
  default: ({ entry }: any) => (
    <div data-testid="editor">
      <div data-testid="editor-content">{entry.content}</div>
      <div data-testid="editor-analysis">{JSON.stringify(entry.analysis)}</div>
    </div>
  ),
}));

describe('EntryPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render Editor with entry data', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    const mockEntry = {
      id: 'entry-1',
      content: 'Entry content',
      analysis: {
        summary: 'Summary',
        subject: 'Subject',
        mood: 'Mood',
        color: 'blue',
        negative: false,
        sentimentScore: 5,
      },
    };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.journalEntry.findUnique as Mock).mockResolvedValue(mockEntry);

    const asyncParams = Promise.resolve({ id: 'entry-1' });

    // Act
    render(<div>{await EntryPage({ params: asyncParams })}</div>);

    // Assert
    expect(await screen.findByTestId('editor')).toBeInTheDocument();
    expect(screen.getByTestId('editor-content')).toHaveTextContent('Entry content');
    expect(screen.getByTestId('editor-analysis')).toHaveTextContent(
      JSON.stringify(mockEntry.analysis),
    );
  });

  it('should call notFound if entry is not found', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.journalEntry.findUnique as Mock).mockResolvedValue(null);

    const asyncParams = Promise.resolve({ id: 'entry-1' });

    // Act
    render(<div>{await EntryPage({ params: asyncParams })}</div>);

    // Assert
    await waitFor(() => expect(notFound).toHaveBeenCalled());
  });

  it('should call notFound if entry has no analysis', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    const mockEntry = {
      id: 'entry-1',
      content: 'Entry content',
      analysis: null,
    };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.journalEntry.findUnique as Mock).mockResolvedValue(mockEntry);

    const asyncParams = Promise.resolve({ id: 'entry-1' });

    // Act
    render(<div>{await EntryPage({ params: asyncParams })}</div>);

    // Assert
    await waitFor(() => expect(notFound).toHaveBeenCalled());
  });
});
