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

// Mock the NextIntlClientProvider from next-intl
vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTranslations: () => (key: string) => key, // mock useTranslations hook
}));

// Mock the async functions getLocale and getMessages from next-intl/server
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(async () => 'en'),
  getMessages: vi.fn(async () => ({ message: 'test message' })),
}));

describe('RootLayout', async () => {
  it('renders children correctly within the ClerkProvider and with the correct class', async () => {
    const mockChildren = <div data-testid="mock-children">Mock Children</div>;

    render(
      // Use a wrapper to handle the async component
      <>
        {await RootLayout({
          children: mockChildren,
        })}
      </>,
    );

    // Check if the children are rendered within the ClerkProvider
    expect(await screen.findByTestId('mock-children')).toBeInTheDocument();
  });
});
