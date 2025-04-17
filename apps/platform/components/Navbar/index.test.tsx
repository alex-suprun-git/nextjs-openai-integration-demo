import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Navbar from '.';

// Mock components
vi.mock('react-icons/fi', () => ({
  FiMenu: () => <div>FiMenu Icon</div>,
}));

vi.mock('@clerk/nextjs', () => ({
  UserButton: ({ afterSignOutUrl }: { afterSignOutUrl: string }) => (
    <div>UserButton {afterSignOutUrl}</div>
  ),
}));

vi.mock('../LanguageSwitcher', () => ({
  __esModule: true,
  default: () => <div>LanguageSwitcher</div>,
}));

vi.mock('../Navigation', () => ({
  __esModule: true,
  default: () => <div>Navigation</div>,
}));

vi.mock('@/ui-lib', () => ({
  Drawer: ({ icon, children }: { icon: React.JSX.Element; children: React.JSX.Element[] }) => (
    <div>
      Drawer {icon}
      {children}
    </div>
  ),
  Header: ({ children }: { children: React.JSX.Element[] }) => <div>Header {children}</div>,
  PromptCounter: () => <div>PromptCounter</div>,
}));

describe('Navbar Component', () => {
  it('renders correctly', () => {
    const { container } = render(<Navbar />);
    expect(container).toMatchSnapshot();
  });

  it('renders Navigation inside Drawer on small screens', () => {
    render(<Navbar />);
    expect(screen.getByText('FiMenu Icon')).toBeInTheDocument();
    expect(screen.getAllByText('Navigation')[0]).toBeVisible();
    expect(screen.getAllByText('PromptCounter')[0]).toBeVisible();
  });

  it('renders Navigation and PromptCounter directly on large screens', () => {
    render(<Navbar />);
    expect(screen.getAllByText('Navigation')[0]).toBeVisible();
    expect(screen.getAllByText('PromptCounter')[0]).toBeVisible();
  });

  it('renders LanguageSwitcher and UserButton', () => {
    render(<Navbar />);
    expect(screen.getByText('LanguageSwitcher')).toBeVisible();
  });
});
