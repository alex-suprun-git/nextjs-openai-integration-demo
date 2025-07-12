'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/',
    });
    // signIn with redirect:true will handle navigation, but if error returned, show it
    if (res && res.error) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <form
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-base-100 p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-2 text-center text-2xl font-bold">Sign In</h1>
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            className="input-bordered input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            className="input-bordered input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-center text-sm text-error">{error}</div>}
        <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 underline hover:text-blue-800">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
