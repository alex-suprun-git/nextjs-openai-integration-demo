import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createTranslator, useTranslations } from 'next-intl';
import Question from '.';
import { askQuestion, updateUserPromptUsage } from '@/utils/api';
import { usePrompt } from '@/contexts/PromptContext';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/utils/api', () => ({
  askQuestion: vi.fn(),
  updateUserPromptUsage: vi.fn(),
}));

vi.mock('@/contexts/PromptContext', () => ({
  usePrompt: vi.fn(),
}));

describe('Question', () => {
  const getPlaceholderRegex = /e.g. how good was my week in average?/i;

  const mockRefresh = vi.fn();

  const mockPromptContext = {
    symbolsUsed: '50',
    symbolsLimit: '100',
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

    (useRouter as Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<Question />);
    expect(container).toMatchSnapshot();
  });

  it('disables input and button when loading', async () => {
    (askQuestion as Mock).mockResolvedValueOnce({ data: 'This is the answer' });

    render(<Question />);
    fireEvent.change(screen.getByPlaceholderText(getPlaceholderRegex), {
      target: { value: 'This is a test question' },
    });

    const button = await screen.findByRole('button');

    fireEvent.submit(button);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(getPlaceholderRegex)).toBeDisabled();
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(screen.getByText('This is the answer')).toBeInTheDocument();
    });
  });

  it('calls askQuestion and updateUserPromptUsage on submit', async () => {
    (askQuestion as Mock).mockResolvedValueOnce({ data: 'This is the answer' });

    render(<Question />);

    fireEvent.change(screen.getByPlaceholderText(getPlaceholderRegex), {
      target: { value: 'This is a test question' },
    });

    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(askQuestion).toHaveBeenCalledWith('This is a test question');
    });

    await waitFor(() => {
      expect(updateUserPromptUsage).toHaveBeenCalledWith(23); // content length
    });

    await waitFor(() => {
      expect(screen.getByText('This is the answer')).toBeInTheDocument();
    });
  });

  it('does not render when prompt symbols are exceeded', () => {
    (usePrompt as Mock).mockReturnValue({
      symbolsUsed: '100',
      symbolsLimit: '100',
    });

    const { container } = render(<Question />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows an error message on failed question submission', async () => {
    (askQuestion as Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<Question />);

    fireEvent.change(screen.getByPlaceholderText(getPlaceholderRegex), {
      target: { value: 'This is a test question' },
    });

    fireEvent.submit(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Error occurred')).toBeInTheDocument();
    });
  });
});
