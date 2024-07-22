import { render, screen } from '@testing-library/react';
import PageNotFound from '@/app/not-found';
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

    // Check if the paragraph has the correct styles
    const paragraph = screen.getByText('Sorry, we can`t find that page.');
    expect(paragraph).toHaveClass('mb-4 text-lg font-light text-gray-500 dark:text-gray-400');

    // Check if the link has the correct styles
    const linkElement = screen.getByRole('link', { name: /back to homepage/i });
    expect(linkElement).toHaveClass(
      'focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-stone-300 hover:bg-blue-800 focus:outline-none focus:ring-4',
    );
  });
});
