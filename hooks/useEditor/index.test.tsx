import { renderHook, act } from '@testing-library/react';
import { Mock } from 'vitest';
import { usePathname, useRouter } from 'next/navigation';
import { usePrompt } from '@/contexts/PromptContext';
import { useEditor } from '@/hooks/useEditor';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('@/contexts/PromptContext', () => ({
  usePrompt: vi.fn(),
}));

vi.mock('@/utils/api', () => ({
  updateEntry: vi.fn(),
  createNewEntry: vi.fn(),
  updateUserPromptUsage: vi.fn(),
}));

vi.mock('react-autosave', () => ({
  useAutosave: vi.fn(),
}));

// TODO: Write more tests
describe('useEditor', () => {
  const mockEntry = {
    content: 'Initial content',
    id: '123',
    analysis: {
      mood: 'happy',
      summary: 'summary',
      color: 'green',
      sentimentScore: 8,
      negative: false,
      subject: 'subject',
    },
  };
  const mockNewTextContent =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';
  const mockRouter = { push: vi.fn(), refresh: vi.fn() };
  const mockUsePrompt = { promptSymbolsUsed: 0, promptSymbolsLimit: 100 };

  beforeEach(() => {
    (usePathname as Mock).mockReturnValue('/journal/new-entry');
    (useRouter as Mock).mockReturnValue(mockRouter);
    (usePrompt as Mock).mockReturnValue(mockUsePrompt);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => useEditor(mockEntry));

    expect(result.current.contentValue).toBe('Initial content');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isContentEntryUpdated).toBe(false);
    expect(result.current.analysis).toEqual(mockEntry.analysis);
  });

  it('should handle content change', () => {
    const { result } = renderHook(() => useEditor(mockEntry));

    act(() => {
      result.current.contentChangeHandler({
        target: { value: mockNewTextContent },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });

    expect(result.current.contentValue).toBe(mockNewTextContent);
  });
});
