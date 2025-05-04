import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/about',
}));
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}));
vi.mock('@/app/utils', () => ({
  getPageURL: (path: string) => {
    const parts = path.split('/').filter(Boolean);
    return parts[1] || '';
  },
}));
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher (pathname variant)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both languages with correct links', () => {
    render(<LanguageSwitcher />);

    const enLink = screen.getByRole('link', { name: /english/i });
    expect(enLink).toHaveAttribute('href', '/en/about');
    expect(enLink.querySelector('strong')).toBeTruthy();

    const deLink = screen.getByRole('link', { name: /deutsch/i });
    expect(deLink).toHaveAttribute('href', '/de/about');
    expect(deLink.querySelector('strong')).toBeNull();
  });
});
