import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Header from './';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links correctly', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    const { container } = render(<Header userPromptLimit="1000" userPromptUsed="500" />);
    expect(container).toMatchSnapshot();

    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('applies active class to the current path link', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    render(<Header userPromptLimit="1000" userPromptUsed="500" />);

    expect(screen.getByRole('link', { name: 'Journal' })).toHaveClass('font-bold');
    expect(screen.getByRole('link', { name: 'Statistics' })).not.toHaveClass('font-bold');
  });

  it('displays the correct prompt usage', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    render(<Header userPromptLimit="1000" userPromptUsed="500" />);

    expect(screen.getByText('500/1000')).toBeInTheDocument();
    expect(screen.getByText('prompt symbols remaining', { exact: false })).toBeInTheDocument();
  });
});
