import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | OpenAI Daily Dashboard',
  description: 'Sign up page for OpenAI Daily Dashboard',
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
