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
    (usePathname as Mock).mockReturnValue('/journal');
    const { container } = render(
      <Header>
        <a href="/journal">Journal</a>
        <a href="/statistics">Statistics</a>
      </Header>,
    );
    expect(container).toMatchSnapshot();

    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('applies active class to the current path link', () => {
    (usePathname as Mock).mockReturnValue('/journal');
    render(
      <Header>
        <a href="/journal" className="font-bold">
          Journal
        </a>
        <a href="/statistics">Statistics</a>
      </Header>,
    );

    expect(screen.getByRole('link', { name: 'Journal' })).toHaveClass('font-bold');
    expect(screen.getByRole('link', { name: 'Statistics' })).not.toHaveClass('font-bold');
  });
});
