import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Logo from './';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, width, height, alt }: any) => (
    <img src={src} width={width} height={height} alt={alt} data-testid="image" />
  ),
}));

describe('Logo', () => {
  const onClickMock = vi.fn();
  const className = 'test-class';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders link with correct href and className', () => {
    render(<Logo onClick={onClickMock} className={className} />);

    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveClass(className);
  });

  it('renders image with correct props', () => {
    render(<Logo className={className} />);

    const img = screen.getByTestId('image');
    expect(img).toHaveAttribute('src', '/public/assets/logo.png');
    expect(img).toHaveAttribute('width', '120');
    expect(img).toHaveAttribute('height', '50');
    expect(img).toHaveAttribute('alt', 'logo');
  });

  it('calls onClick handler when link is clicked', () => {
    render(<Logo onClick={onClickMock} className={className} />);

    const link = screen.getByTestId('link');
    fireEvent.click(link);
    expect(onClickMock).toHaveBeenCalled();
  });
});
