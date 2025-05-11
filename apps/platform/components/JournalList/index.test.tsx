import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JournalList from '.';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('../EntryCard', () => ({
  default: ({
    id,
    createdAt,
    updatedAt,
    content,
    color,
  }: {
    id: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    color: string;
  }) => (
    <div data-testid="entry-card">
      <p>{id}</p>
      <p>{createdAt}</p>
      <p>{updatedAt}</p>
      <p>{content}</p>
      <p>{color}</p>
    </div>
  ),
}));

vi.mock('../NewEntryCard', () => ({
  default: () => <div data-testid="new-entry-card" />,
}));

vi.mock('../Question', () => ({
  default: () => <div data-testid="question" />,
}));
describe('JournalList Component', () => {
  it('renders Question component when entries are present', () => {
    const entries = [
      {
        id: '1',
        createdAt: '2024-07-19T12:34:56Z',
        updatedAt: '2024-07-19T12:34:56Z',
        content: 'Test Entry',
        analysis: {
          color: 'blue',
        },
      },
    ];

    render(<JournalList entries={entries as any[]} />);
    const question = screen.getByTestId('question');
    expect(question).toBeInTheDocument();
  });

  it('renders NewEntryCard component', () => {
    render(<JournalList entries={[]} />);
    const newEntryCard = screen.getByTestId('new-entry-card');
    expect(newEntryCard).toBeInTheDocument();
  });
});
