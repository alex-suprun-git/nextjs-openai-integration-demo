import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Heading from '.';

describe('Heading', () => {
  it('renders correctly with children', () => {
    const { container } = render(<Heading>Sample heading text</Heading>);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('Sample heading text')).toBeInTheDocument();
  });

  it('applies the correct class names', () => {
    render(<Heading>Sample heading text</Heading>);
    const h1Element = screen.getByRole('heading');
    expect(h1Element).toHaveClass('mb-12');
    expect(h1Element).toHaveClass('text-5xl');
    expect(h1Element).toHaveClass('font-bold');
    expect(h1Element).toHaveClass('text-stone-300');
  });
});
