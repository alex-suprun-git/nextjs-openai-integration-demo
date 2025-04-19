import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import * as nextNav from 'next/navigation';
import Navigation from './.';

vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'navigation.aboutMe': 'About Me',
      'navigation.gitHub': 'GitHub',
    };
    return translations[key] || key;
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('@/constants', () => ({ BASE_TEXT_COLOR_HEX: '#000000' }));
vi.mock('../Logo', () => ({ default: () => <div data-testid="logo" /> }));

describe('Navigation', () => {
  const usePathname = nextNav.usePathname as Mock;
  const onClickMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links with correct hrefs and targets', () => {
    usePathname.mockReturnValue('/en/about-me');
    render(<Navigation onClick={onClickMock} />);

    // Проверяем ссылку "About Me"
    const aboutLink = screen.getByRole('link', { name: /About Me/i });
    expect(aboutLink).toHaveAttribute('href', '/en/about-me');
    expect(aboutLink).toHaveAttribute('target', '_self');

    // Проверяем ссылку "GitHub"
    const githubLink = screen.getByRole('link', { name: /GitHub/i });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/alex-suprun-git/nextjs-openai-integration-demo',
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('highlights active link based on pathname', () => {
    usePathname.mockReturnValue('/en/about-me');
    render(<Navigation onClick={onClickMock} />);

    const aboutLink = screen.getByRole('link', { name: /About Me/i });
    const githubLink = screen.getByRole('link', { name: /GitHub/i });

    // Активная ссылка должна иметь bold класс
    expect(aboutLink).toHaveClass('font-bold');
    expect(githubLink).not.toHaveClass('font-bold');
  });

  it('calls onClick handler when any link is clicked', () => {
    usePathname.mockReturnValue('/');
    render(<Navigation onClick={onClickMock} />);

    const aboutLink = screen.getByRole('link', { name: /About Me/i });
    fireEvent.click(aboutLink);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
