'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const t = useTranslations('Auth.signUp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === 'User exists') {
          setError(t('userExists'));
        } else if (data.message === 'Missing fields') {
          setError(t('missingFields'));
        } else if (data.message === 'Invalid email format') {
          setError(t('invalidEmailFormat'));
        } else if (data.message === 'Password too short') {
          setError(t('passwordTooShort'));
        } else if (data.message === 'Server error') {
          setError(t('serverError'));
        } else {
          setError(t('unexpectedError'));
        }
        return;
      }

      // Successful signup
      router.push(`/sign-in?message=${encodeURIComponent(t('accountCreated'))}`);
    } catch {
      setError(t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <form
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg bg-base-100 p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-2 text-center text-2xl font-bold">{t('title')}</h1>
        <div className="form-control">
          <label className="label" htmlFor="email">
            <span className="label-text">{t('email')}</span>
          </label>
          <input
            id="email"
            type="email"
            className="input-bordered input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">{t('password')}</span>
          </label>
          <input
            id="password"
            type="password"
            className="input-bordered input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
        {error && <div className="text-center text-sm text-error">{error}</div>}
        <button
          className="btn mt-2 bg-yellow-200 text-black hover:bg-yellow-300"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? t('loading') : t('submit')}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t('hasAccount')}{' '}
            <Link href="/sign-in" className="border-b-2 text-white">
              {t('signInLink')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
