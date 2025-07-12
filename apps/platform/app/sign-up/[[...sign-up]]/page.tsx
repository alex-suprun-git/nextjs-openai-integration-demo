'use client';
import { useState } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | OpenAI Daily Dashboard',
  description: 'Sign up page for OpenAI Daily Dashboard',
};

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input-bordered input w-full"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="input-bordered input w-full"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="btn w-full" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}
