import { describe, it, expect, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageNotFound from '@/app/platform/journal/[id]/not-found';
import { createTranslator, useTranslations } from 'next-intl';

describe('PageNotFound', () => {
  beforeEach(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'E404JournalEntry',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    // Act
    render(<PageNotFound />);

    // Assert
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Sorry, we can`t find that note.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /back to journal page/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/journal');
  });
});
