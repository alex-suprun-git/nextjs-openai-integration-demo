import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createTranslator, useTranslations } from 'next-intl';
import Question from '.';
import { askQuestion, updateUser } from '@/utils/api';
import { usePrompt } from '@/contexts/PromptContext';

vi.mock('@/utils/api', () => ({
  askQuestion: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock('@/contexts/PromptContext', () => ({
  usePrompt: vi.fn(),
}));

describe('Question', () => {
  const mockPromptContext = {
    promptSymbolsUsed: 50,
    promptSymbolsLimit: 100,
  };

  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'analysisRequest',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (usePrompt as Mock).mockReturnValue(mockPromptContext);
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<Question />);
    expect(container).toMatchSnapshot();
  });

  it('disables input and button when loading', async () => {
    (askQuestion as Mock).mockResolvedValueOnce({ data: 'This is the answer' });

    render(<Question />);
    fireEvent.change(screen.getByPlaceholderText(/how good was my week in average/i), {
      target: { value: 'This is a test question' },
    });

    const button = await screen.findByRole('button');

    fireEvent.submit(button);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/how good was my week in average/i)).toBeDisabled();
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('This is the answer')).toBeInTheDocument();
    });
  });

  it('calls askQuestion and updateUser on submit', async () => {
    (askQuestion as Mock).mockResolvedValueOnce({ data: 'This is the answer' });

    render(<Question />);

    fireEvent.change(screen.getByPlaceholderText(/how good was my week in average/i), {
      target: { value: 'This is a test question' },
    });

    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(askQuestion).toHaveBeenCalledWith('This is a test question');
    });

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(mockPromptContext.promptSymbolsUsed + 23);
    });

    await waitFor(() => {
      expect(screen.getByText('This is the answer')).toBeInTheDocument();
    });
  });

  it('does not render when prompt symbols are exceeded', () => {
    (usePrompt as Mock).mockReturnValue({
      promptSymbolsUsed: 100,
      promptSymbolsLimit: 100,
    });

    const { container } = render(<Question />);
    expect(container).toBeEmptyDOMElement();
  });
});
