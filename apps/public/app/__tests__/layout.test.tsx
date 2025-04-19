import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLocaleLayout from '@/app/[locale]/layout';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-intl', () => ({
  hasLocale: (_locales: string[], _locale: string) => true,
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

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speedinsights" />,
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter-class' }),
}));

describe('RootLocaleLayout (mocked)', () => {
  it('renders children, Navbar и SpeedInsights', async () => {
    const mockChildren = <div data-testid="mock-children">Mock Children</div>;

    const element = await RootLocaleLayout({
      children: mockChildren,
      params: Promise.resolve({ locale: 'en' }),
    });

    render(element);

    expect(screen.getByTestId('intl')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
    expect(screen.getByTestId('speedinsights')).toBeInTheDocument();
  });
});
