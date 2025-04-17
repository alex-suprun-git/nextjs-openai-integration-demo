import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewEntryPage from '@/app/(pages)/new-entry/page';

// Mock the Editor component
vi.mock('@/components/Editor', () => ({
  default: ({ entry }: any) => (
    <div data-testid="editor">
      <div data-testid="editor-content">{entry.content}</div>
      <div data-testid="editor-analysis">{JSON.stringify(entry.analysis)}</div>
    </div>
  ),
}));

describe('NewEntryPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render Editor with initial data', () => {
    // Act
    render(<NewEntryPage />);

    // Assert
    const editor = screen.getByTestId('editor');
    expect(editor).toBeInTheDocument();

    const content = screen.getByTestId('editor-content');
    expect(content).toHaveTextContent('');

    const analysis = screen.getByTestId('editor-analysis');
    expect(analysis).toHaveTextContent(
      JSON.stringify({
        summary: 'unknown',
        subject: 'unknown',
        mood: 'unknown',
        color: '#4B5563',
        negative: false,
        sentimentScore: 0,
      }),
    );
  });
});
