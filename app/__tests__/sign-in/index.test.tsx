import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SignInPage from '@/app/(platform)/sign-in/[[...sign-in]]/page';

// Mock the SignUp component from @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  SignIn: () => <div data-testid="signin-mock">SignIn Component</div>,
}));

describe('SignInPage', () => {
  it('renders the SignUp component correctly', () => {
    render(<SignInPage />);

    // Check if the SignUp component is rendered within the SignUpPage
    const signUpElement = screen.getByTestId('signin-mock');
    expect(signUpElement).toBeInTheDocument();
    expect(signUpElement).toHaveTextContent('SignIn Component');
  });

  it('has the correct styling applied', () => {
    render(<SignInPage />);
  });
});
