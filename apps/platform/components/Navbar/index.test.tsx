import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from './';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock FiMenu icon
vi.mock('react-icons/fi', () => ({
  FiMenu: () => <div data-testid="fi-menu">FiMenu Icon</div>,
  FiLogOut: () => <div data-testid="fi-logout">FiLogOut Icon</div>,
}));

// Mock NextAuth hooks
vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { email: 'test@example.com' } } }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// Mock LanguageSwitcher
vi.mock('../LanguageSwitcher', () => ({
  __esModule: true,
  default: () => <div data-testid="language-switcher">LanguageSwitcher</div>,
}));

// Mock Navigation
vi.mock('../Navigation', () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    <div data-testid="navigation" onClick={onClick}>
      Navigation
    </div>
  ),
}));

// Mock Repo UI components
vi.mock('@repo/global-ui', () => ({
  __esModule: true,
  Drawer: ({ icon, children }: any) => (
    <div data-testid="drawer">
      <div data-testid="drawer-icon">{icon}</div>
      {children}
    </div>
  ),
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
}));

// Mock PromptCounter
vi.mock('@/ui-lib/PromptCounter', () => ({
  __esModule: true,
  default: () => <div data-testid="prompt-counter">PromptCounter</div>,
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Header wrapper', () => {
    render(<Navbar />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders Navigation and Logo in navbar-start and center', () => {
    render(<Navbar />);
    // Navigation rendered twice (start and inside drawer)
    const navItems = screen.getAllByTestId('navigation');
    expect(navItems.length).toBeGreaterThanOrEqual(1);
    // PromptCounter rendered twice (inside drawer and in center)
    const counters = screen.getAllByTestId('prompt-counter');
    expect(counters.length).toBeGreaterThanOrEqual(1);
  });

  it('renders LanguageSwitcher and auth button in navbar-end', () => {
    render(<Navbar />);
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
