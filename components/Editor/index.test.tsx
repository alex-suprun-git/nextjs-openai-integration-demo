import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useAutosave } from 'react-autosave';
import { usePathname, useRouter } from 'next/navigation';
import { createTranslator, useTranslations } from 'next-intl';
import Editor from '.';
import { usePrompt } from '@/contexts/PromptContext';
import { createNewEntry, updateUserPromptUsage } from '@/utils/api';

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

const mockContent =
  'This is a sufficiently long updated entry content to meet the minimum content length requirement';

const mockEntry = {
  content: mockContent,
  id: '1',
  analysis: {
    summary: 'summary',
    subject: 'subject',
    mood: 'happy',
    color: '#ff0000',
    negative: false,
  },
} as any;

describe('Editor', () => {
  const mockRouterPush = vi.fn();
  const mockRouterRefresh = vi.fn();

  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'Editor',
      messages: (await import('../../messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as Mock).mockReturnValue('/journal/new-entry');
    (useRouter as Mock).mockReturnValue({
      push: mockRouterPush,
      refresh: mockRouterRefresh,
    });
    (usePrompt as Mock).mockReturnValue({
      symbolsUsed: '50',
      symbolsLimit: '10000',
    });
    (useAutosave as Mock).mockImplementation(({ data, onSave }) => {
      setTimeout(() => {
        onSave(data);
      }, 100);
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<Editor entry={mockEntry} />);
    expect(container).toMatchSnapshot();
  });

  it('calls saveContent with correct parameters on autosave', async () => {
    (updateUserPromptUsage as Mock).mockResolvedValue({});
    (createNewEntry as Mock).mockResolvedValue({ id: 'new-id' });

    render(<Editor entry={mockEntry} />);

    // Trigger autosave by updating the content value
    const textarea = screen.getByPlaceholderText('Please write your thoughts here...');
    fireEvent.change(textarea, {
      target: {
        value: mockContent,
      },
    });

    await waitFor(() => {
      expect(updateUserPromptUsage).toHaveBeenCalledWith(96); // content length
    });

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/journal/new-id');
    });

    await waitFor(() => {
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it('updates content and handles prompt symbol limits', () => {
    render(<Editor entry={mockEntry} />);
    const textarea = screen.getByPlaceholderText('Please write your thoughts here...');

    fireEvent.change(textarea, {
      target: { value: mockContent },
    });
    expect(textarea).toHaveValue(mockContent);
  });
});
