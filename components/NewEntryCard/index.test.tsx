import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { useRouter } from 'next/navigation';
import NewEntryCard from '.';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('NewEntryCard', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<NewEntryCard />);
    expect(container).toMatchSnapshot();
  });

  it('renders with correct text', () => {
    render(<NewEntryCard />);
    expect(screen.getByText('Write a new memo')).toBeInTheDocument();
  });

  it('navigates to the correct path on click', () => {
    render(<NewEntryCard />);
    fireEvent.click(screen.getByText('Write a new memo'));
    expect(mockPush).toHaveBeenCalledWith('/journal/new-entry');
  });
});
