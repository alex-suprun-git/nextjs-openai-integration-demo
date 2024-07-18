import { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Sign Up | OpenAI Daily Journal',
  description: 'Sign up page for OpenAI Daily Journal',
};

function SignUpPage() {
  return (
    <div className="mt-20 flex justify-center">
      <SignUp />
    </div>
  );
}
export default SignUpPage;
