import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Alert from './index';

describe('Alert', () => {
  enum AlertTypes {
    'info' = 'info',
    'warning' = 'warning',
    'error' = 'error',
    'success' = 'success',
  }

  it('renders with default info type when no type is provided', () => {
    render(<Alert>Test Message</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('alert alert-info mb-6');
  });

  const types = ['info', 'warning', 'error', 'success'] as AlertTypes[];
  types.forEach((type) => {
    it(`renders correctly for type ${type}`, () => {
      render(<Alert type={type}>Test Message</Alert>);
      const expectedClass =
        type === 'error'
          ? 'alert alert-error text-white bg-red-800 mb-6'
          : `alert alert-${type} mb-6`;
      expect(screen.getByRole('alert')).toHaveClass(expectedClass);
    });
  });

  it('renders children correctly', () => {
    const testMessage = 'This is a test message';
    render(<Alert>{testMessage}</Alert>);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });
});
