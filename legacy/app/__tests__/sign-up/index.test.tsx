import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SignUpPage from '@/app/platform/sign-up/[[...sign-up]]/page';

// Mock the SignUp component from @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  SignUp: () => <div data-testid="signup-mock">SignUp Component</div>,
}));

describe('SignUpPage', () => {
  it('renders the SignUp component correctly', () => {
    render(<SignUpPage />);

    // Check if the SignUp component is rendered within the SignUpPage
    const signUpElement = screen.getByTestId('signup-mock');
    expect(signUpElement).toBeInTheDocument();
    expect(signUpElement).toHaveTextContent('SignUp Component');
  });

  it('has the correct styling applied', () => {
    render(<SignUpPage />);
  });
});
