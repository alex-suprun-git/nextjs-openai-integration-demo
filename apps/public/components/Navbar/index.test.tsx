import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import * as nextNav from 'next/navigation';
import Navbar from './';

// Mock next-intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'navigation.toPlatform': 'Go to Platform',
      'navigation.logIn': 'Log In',
      'navigation.aboutMe': 'About Me',
      'navigation.gitHub': 'GitHub',
    };
    return translations[key] || key;
  },
}));

vi.mock('@repo/global-utils/helpers', () => ({
  getCurrentEnv: () => 'development',
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));
const mockedUsePathname = nextNav.usePathname as Mock;

// Mock repo constants and components
vi.mock('@/constants', () => ({
  PLATFORM_BASE_URL: { development: 'http://localhost:3001' },
  getPlatformUrl: () => 'http://localhost:3001',
}));

vi.mock('../Navigation', () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    <div data-testid="navigation" onClick={onClick}>
      Navigation
    </div>
  ),
}));
vi.mock('react-icons/fi', () => ({ FiMenu: () => <div data-testid="fi-menu">Menu Icon</div> }));
vi.mock('@repo/global-ui', () => ({
  __esModule: true,
  Drawer: ({ icon, children, toggleRef }: any) => (
    <div data-testid="drawer">
      <div data-testid="drawer-icon">{icon}</div>
      {children}
    </div>
  ),
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
}));

// Mock Logo and LanguageSwitcher components
vi.mock('../Logo', () => ({
  __esModule: true,
  default: ({ onClick, className }: any) => (
    <div data-testid="logo" onClick={onClick} className={className}>
      Logo
    </div>
  ),
}));

vi.mock('../LanguageSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="language-switcher">LanguageSwitcher</div>,
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Header wrapper and Navigation', () => {
    mockedUsePathname.mockReturnValue('/en/about-me');
    render(<Navbar />);
    expect(screen.getAllByTestId('header')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('navigation')[0]).toBeInTheDocument();
  });

  it('renders Go to Platform link correctly', () => {
    render(<Navbar />);
    const link = screen.getByRole('link', { name: /Go to Platform/i });
    expect(link).toHaveAttribute('href', 'http://localhost:3001');
  });

  it('drawerToggleHandler closes drawer without errors', () => {
    render(<Navbar />);
    const navItems = screen.getAllByTestId('navigation');
    // Click each navigation instance to trigger drawerToggleHandler
    navItems.forEach((item) => fireEvent.click(item));
    // Drawer remains in the document, handler executed without errors
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });
});
