import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from '@/app/(public-pages)/[locale]/layout';

vi.mock('@/app/(public-pages)/layout', async () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

// Mock the Inter function
vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-class',
  }),
}));

// Mock the ClerkProvider from @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="clerkProvider">{children}</div>
  ),
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

describe.skip('RootLayout (mocked)', () => {
  it('renders children correctly', () => {
    const mockChildren = <div data-testid="mock-children">Mock Children</div>;

    render(<RootLayout>{mockChildren}</RootLayout>);

    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });
});
