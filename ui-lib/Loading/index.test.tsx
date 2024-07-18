import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '.';

describe('Loading', () => {
  it('renders correctly with children', () => {
    const { container } = render(<Loading>Loading...</Loading>);
    expect(container).toMatchSnapshot();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('applies the correct class names', () => {
    render(<Loading>Loading...</Loading>);
    const divElement = screen.getByTestId('loading-ui-component');
    expect(divElement).toHaveClass('loading');
    expect(divElement).toHaveClass('loading-lg');
  });

  it('applies custom classes correctly', () => {
    const customClasses = 'custom-class another-class';
    render(<Loading customClasses={customClasses}>Loading...</Loading>);
    const divElement = screen.getByTestId('loading-ui-component');
    expect(divElement).toHaveClass('custom-class');
    expect(divElement).toHaveClass('another-class');
  });

  it('renders correctly without children', () => {
    render(<Loading />);
    const divElement = screen.getByTestId('loading-ui-component');
    expect(divElement).toBeInTheDocument();
    expect(divElement).toBeEmptyDOMElement();
  });

  it('renders correctly fullscreen loader', () => {
    render(<Loading fullscreen />);
    const divElement = screen.getByTestId('loading-ui-component');
    expect(divElement).toBeInTheDocument();
    expect(divElement).not.toBeEmptyDOMElement();
  });
});
