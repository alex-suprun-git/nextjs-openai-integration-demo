import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromptProvider, usePrompt } from '../PromptContext';
import TestComponent from '.';

describe('PromptContext', () => {
  it('provides the correct context values', () => {
    const mockValue = {
      symbolsLimit: '1000',
      symbolsUsed: '500',
      limitRenewalDate: '2023-12-31',
    };

    render(
      <PromptProvider value={mockValue}>
        <TestComponent />
      </PromptProvider>,
    );

    expect(screen.getByTestId('limit')).toHaveTextContent('1000');
    expect(screen.getByTestId('used')).toHaveTextContent('500');
  });

  it('throws an error when used outside of the PromptProvider', () => {
    const originalConsoleError = console.error;
    console.error = vi.fn(); // Suppress error output in the test

    const ErrorComponent = () => {
      try {
        usePrompt();
      } catch (e: any) {
        return <span data-testid="error">{e.message}</span>;
      }
      return null;
    };

    render(<ErrorComponent />);

    expect(screen.getByTestId('error')).toHaveTextContent(
      'usePrompt must be used within a PromptProvider',
    );

    console.error = originalConsoleError; // Restore original console.error
  });
});
