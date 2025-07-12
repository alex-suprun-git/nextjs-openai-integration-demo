import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | OpenAI Daily Dashboard',
  description: 'Sign in page for OpenAI Daily Dashboard',
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
