import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ErrorMessage from './index';

vi.mock('next-intl', () => ({
  useTranslations: (namespace: string) => {
    const translations: Record<string, Record<string, string>> = {
      ErrorBoundary: {
        headline: 'An unexpected error occurred',
        'buttons.tryAgain': 'Try Again',
      },
    };
    return (key: string) => translations[namespace]?.[key] || key;
  },
}));

describe('ErrorMessage Component', () => {
  it('renders the headline and button with translations', () => {
    const error = new Error('Test error message');
    const reset = vi.fn();

    render(<ErrorMessage error={error} reset={reset} />);

    // Check that the headline is rendered with the correct translation
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toBeInTheDocument();
    expect(headline).toHaveTextContent('An unexpected error occurred');

    // Check that the button is rendered with the correct translation
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Try Again');
  });

  it('renders the error message when error.message exists', () => {
    const error = new Error('Test error message');
    const reset = vi.fn();

    render(<ErrorMessage error={error} reset={reset} />);

    // Check that the error message is rendered
    const errorMessage = screen.getByText('Test error message');
    expect(errorMessage).toBeInTheDocument();
  });

  it('does not render the error message when error.message is empty', () => {
    const error = new Error('');
    const reset = vi.fn();

    render(<ErrorMessage error={error} reset={reset} />);

    // Check that no error message is rendered
    const errorMessage = screen.queryByText('Test error message');
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('calls the reset function when the button is clicked', () => {
    const error = new Error('Test error message');
    const reset = vi.fn();

    render(<ErrorMessage error={error} reset={reset} />);

    // Simulate button click
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Check that reset function was called
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
