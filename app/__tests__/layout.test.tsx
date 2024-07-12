import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/layout';

// Mock the Inter function
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-class',
  }),
}));

// Mock the ClerkProvider from @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('RootLayout', () => {
  it('renders children correctly within the ClerkProvider and with the correct class', () => {
    const mockChildren = <div data-testid="mock-children">Mock Children</div>;

    render(<RootLayout>{mockChildren}</RootLayout>, {
      container: document.body.appendChild(document.createElement('div')),
    });

    // Check if the children are rendered within the ClerkProvider
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });
});
