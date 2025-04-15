import { render } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { vi, Mock } from 'vitest';
import Navigation from '.';

// Mock usePathname
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock useTranslations
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('Navigation Component', () => {
  it('renders correctly when no link is active', () => {
    (usePathname as Mock).mockReturnValue('/');
    (useTranslations as Mock).mockReturnValue((key: string) => {
      switch (key) {
        case 'navigation.journal':
          return 'Journal';
        case 'navigation.statistics':
          return 'Statistics';
        default:
          return key;
      }
    });

    const { container } = render(<Navigation />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when journal link is active', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    (useTranslations as Mock).mockReturnValue((key: string) => {
      switch (key) {
        case 'navigation.journal':
          return 'Journal';
        case 'navigation.statistics':
          return 'Statistics';
        default:
          return key;
      }
    });

    const { container } = render(<Navigation />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when statistics link is active', () => {
    (usePathname as Mock).mockReturnValue('/statistics');
    (useTranslations as Mock).mockReturnValue((key: string) => {
      switch (key) {
        case 'navigation.journal':
          return 'Journal';
        case 'navigation.statistics':
          return 'Statistics';
        default:
          return key;
      }
    });

    const { container } = render(<Navigation />);
    expect(container).toMatchSnapshot();
  });
});
