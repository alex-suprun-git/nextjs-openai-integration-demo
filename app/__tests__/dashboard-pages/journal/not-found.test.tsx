import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageNotFound from '@/app/(dashboard)/journal/[id]/not-found';

describe('PageNotFound', () => {
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
