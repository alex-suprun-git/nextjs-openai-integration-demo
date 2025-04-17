import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { createTranslator } from 'next-intl';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import Hero from '.';
import messages from '@/messages/en.json';

type Messages = typeof messages;
type Namespace = keyof Messages;

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: vi.fn(),
}));

const setupTranslations = async (namespace: Namespace) => {
  const translate = createTranslator({
    locale: 'en',
    namespace,
    messages: (await import('@/messages/en.json')).default,
  });

  (useTranslations as Mock).mockImplementation(() => translate);
};

describe.skip('Hero Component', () => {
  beforeEach(async () => {
    await setupTranslations('HomePage');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the headline', () => {
    render(<Hero headline="Welcome" description={{}} />);
    const headline = screen.getByText('Welcome');
    expect(headline).toBeInTheDocument();
  });

  it('renders the description', () => {
    const description = { nodeType: 'document', content: [] };
    (documentToReactComponents as Mock).mockReturnValue(<div>Mocked Description</div>);

    render(<Hero headline="Welcome" description={description} />);
    const descriptionElement = screen.getByText('Mocked Description');
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders the authorized button and link', async () => {
    render(<Hero headline="Welcome" description={{}} />);
    const button = screen.getByRole('button', { name: /go to journal/i });
    const link = screen.getByRole('link');

    expect(button).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders the unauthorized button and link', async () => {
    render(<Hero headline="Welcome" description={{}} />);
    const button = screen.getByRole('button', { name: /get started/i });
    const link = screen.getByRole('link');

    expect(button).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/new-user');
  });
});
