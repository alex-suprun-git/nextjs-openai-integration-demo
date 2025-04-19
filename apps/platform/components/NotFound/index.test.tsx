import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { createTranslator } from 'next-intl';
import { describe, it, expect, afterEach, vi, Mock } from 'vitest';
import NotFound from '.';
import messages from '@/messages/en.json';

type Messages = typeof messages;
type Namespace = keyof Messages;

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const setupTranslations = async (namespace: Namespace = 'E404Homepage') => {
  const translate = createTranslator({
    locale: 'en',
    namespace,
    messages: (await import('@/messages/en.json')).default,
  });

  (useTranslations as Mock).mockImplementation(() => translate);
};

describe('NotFound Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the 404 heading', async () => {
    await setupTranslations();
    render(<NotFound link="/" />);
    const heading = screen.getByText('404');
    expect(heading).toBeInTheDocument();
  });

  it('renders descriptions and link text for journal entry', async () => {
    await setupTranslations('E404JournalEntry');
    render(<NotFound link="/" homepage={false} />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Sorry, we can`t find that note.')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard page')).toBeInTheDocument();
  });

  it('renders the correct link href', async () => {
    await setupTranslations('E404JournalEntry');
    const link = '/some-page';
    render(<NotFound link={link} homepage />);
    const anchor = screen.getByRole('link', { name: /back to dashboard page/i });
    expect(anchor).toHaveAttribute('href', link);
  });
});
