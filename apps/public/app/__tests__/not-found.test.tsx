import { render, screen } from '@testing-library/react';
import PageNotFound from '@/app/[locale]/not-found';
import { createTranslator, useTranslations } from 'next-intl';
import { Mock } from 'vitest';

describe('PageNotFound', () => {
  beforeEach(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'E404Homepage',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the PageNotFound component correctly', () => {
    render(<PageNotFound />);

    // Check if the main elements are rendered
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Sorry, we can`t find that page.')).toBeInTheDocument();

    // Check if the link to the homepage is present and has the correct attributes
    const linkElement = screen.getByRole('link', { name: /back to homepage/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');
  });

  it('has the correct styles applied', () => {
    render(<PageNotFound />);

    // Check if the 404 heading has the correct styles
    const heading = screen.getByText('404');
    expect(heading).toHaveClass('text-7xl font-extrabold tracking-tight text-red-500 lg:text-9xl');

    // Check if the paragraph has the correct text
    const paragraph = screen.getByText('Sorry, we can`t find that page.');
    expect(paragraph).toBeInTheDocument();

    // Check if the link has the correct text and href
    const linkElement = screen.getByRole('link', { name: /back to homepage/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/');
  });
});
