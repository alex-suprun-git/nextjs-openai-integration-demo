import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { Mock, vi } from 'vitest';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Hero from '../Hero';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));
vi.mock('@contentful/rich-text-react-renderer', () => ({
  documentToReactComponents: vi.fn(),
}));
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('@/constants', () => ({
  PLATFORM_BASE_URL: 'https://example.com',
}));

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslations as Mock).mockReturnValue((key: string) => `translated-${key}`);
    (documentToReactComponents as Mock).mockImplementation((doc: Document) => {
      const text = (doc as any)?.content?.[0]?.content?.[0]?.value ?? '';
      return <div data-testid="rich">{text}</div>;
    });
  });

  it('renders headline and rich-text description', () => {
    const headline = 'Test Headline';
    const description = {
      nodeType: 'document',
      content: [{ content: [{ nodeType: 'text', value: 'Test description' }] }],
    } as any;

    render(<Hero headline={headline} description={description} />);

    expect(screen.getByText(headline)).toBeInTheDocument();
    expect(screen.getByTestId('rich')).toHaveTextContent('Test description');
  });

  it('renders a link button with translated text and correct href', () => {
    render(<Hero headline="H" description={{ nodeType: 'document', content: [] } as any} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');

    expect(screen.getByText('translated-linkText')).toBeInTheDocument();
  });
});
