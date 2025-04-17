import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { createTranslator, useTranslations } from 'next-intl';
import Header from '.';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

describe('Header', () => {
  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'Header',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links correctly', () => {
    (usePathname as Mock).mockReturnValue('/');
    const { container } = render(
      <Header>
        <a href="/">Dashboard</a>
        <a href="/statistics">Statistics</a>
      </Header>,
    );
    expect(container).toMatchSnapshot();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('applies active class to the current path link', () => {
    (usePathname as Mock).mockReturnValue('/');
    render(
      <Header>
        <a href="/" className="font-bold">
          Dashboard
        </a>
        <a href="/statistics">Statistics</a>
      </Header>,
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('font-bold');
    expect(screen.getByRole('link', { name: 'Statistics' })).not.toHaveClass('font-bold');
  });
});
