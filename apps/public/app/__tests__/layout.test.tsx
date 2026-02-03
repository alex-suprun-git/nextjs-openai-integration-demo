import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLocaleLayout from '@/app/[locale]/layout';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn(),
  })),
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock('next-intl', () => ({
  hasLocale: () => true,
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="intl">{children}</div>
  ),
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en'] },
}));

vi.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar" />,
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter-class' }),
}));

vi.mock('@c15t/nextjs', () => ({
  ConsentManagerProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="consent-provider">{children}</div>
  ),
  CookieBanner: () => <div data-testid="cookie-banner" />,
  ConsentManagerDialog: () => <div data-testid="consent-dialog" />,
}));

vi.mock('@repo/global-analytics', () => ({
  AnalyticsManager: () => <div data-testid="analytics-manager" />,
}));

describe('RootLocaleLayout (mocked)', () => {
  it('renders children, Navbar', async () => {
    const mockChildren = <div data-testid="mock-children">Mock Children</div>;

    const element = await RootLocaleLayout({
      children: mockChildren,
      params: Promise.resolve({ locale: 'en' }),
    });

    render(element);

    expect(screen.getByTestId('intl')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });
});
