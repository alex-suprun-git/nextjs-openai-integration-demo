'use client';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const t = useTranslations('Auth.signIn');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccess(decodeURIComponent(message));
    }
  }, [searchParams]);

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
      setError(t('invalidCredentials'));
      setLoading(false);
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
          />
        </div>
        {error && <div className="text-center text-sm text-error">{error}</div>}
        {success && <div className="text-center text-sm text-success">{success}</div>}
        <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
          {loading ? t('loading') : t('submit')}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {t('noAccount')}{' '}
            <Link href="/sign-up" className="text-blue-600 underline hover:text-blue-800">
              {t('signUpLink')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
