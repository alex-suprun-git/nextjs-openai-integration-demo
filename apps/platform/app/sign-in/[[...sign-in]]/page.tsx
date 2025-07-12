'use client';
import { signIn } from 'next-auth/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | OpenAI Daily Dashboard',
  description: 'Sign in page for OpenAI Daily Dashboard',
};

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <button className="btn" onClick={() => signIn()}>
        Sign In
      </button>
    </div>
  );
}
