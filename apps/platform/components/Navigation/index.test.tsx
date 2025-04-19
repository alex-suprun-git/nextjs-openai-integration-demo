import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import * as nextNav from 'next/navigation';
import Navigation from './';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const t: Record<string, string> = {
      'navigation.statistics': 'Statistics',
      'navigation.aboutMe': 'About Me',
    };
    return t[key] ?? key;
  },
}));

vi.mock('@repo/global-utils/helpers', () => ({
  getCurrentEnv: () => 'development',
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/constants', () => ({
  PUBLIC_BASE_URL: { development: 'http://localhost:3000' },
}));

vi.mock('../Logo', () => ({ default: () => <div data-testid="logo" /> }));

describe('Navigation', () => {
  const usePathname = nextNav.usePathname as Mock;
  const onClickMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders both links with correct hrefs and labels', () => {
    usePathname.mockReturnValue('/statistics');
    render(<Navigation onClick={onClickMock} />);

    const statsLink = screen.getByRole('link', { name: /Statistics/i });
    const aboutLink = screen.getByRole('link', { name: /About Me/i });

    expect(statsLink).toHaveAttribute('href', '/statistics');
    expect(aboutLink).toHaveAttribute('href', 'http://localhost:3000/about-me');
  });

  it('applies active class to the statistics link when pathname matches', () => {
    usePathname.mockReturnValue('/statistics');
    render(<Navigation onClick={onClickMock} />);

    const statsLink = screen.getByRole('link', { name: /Statistics/i });
    const aboutLink = screen.getByRole('link', { name: /About Me/i });

    expect(statsLink).toHaveClass('font-bold');
    expect(aboutLink).not.toHaveClass('font-bold');
  });

  it('applies active class to the about link when pathname matches', () => {
    usePathname.mockReturnValue('http://localhost:3000/about-me');
    render(<Navigation onClick={onClickMock} />);

    const aboutLink = screen.getByRole('link', { name: /About Me/i });
    expect(aboutLink).toHaveClass('font-bold');
  });

  it('calls onClick handler when a link is clicked', () => {
    usePathname.mockReturnValue('/statistics');
    render(<Navigation onClick={onClickMock} />);

    const statsLink = screen.getByRole('link', { name: /Statistics/i });
    fireEvent.click(statsLink);
    expect(onClickMock).toHaveBeenCalled();
  });
});
