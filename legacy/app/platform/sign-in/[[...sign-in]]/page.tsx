import { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign In | OpenAI Daily Journal',
  description: 'Sign in page for OpenAI Daily Journal',
};

function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <SignIn />
    </div>
  );
}
export default SignInPage;
