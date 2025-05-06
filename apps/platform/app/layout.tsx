import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { deDE, enUS } from '@clerk/localizations';
import { GoogleTagManager } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

import { getCurrentEnv } from '@repo/global-utils/helpers';
import { LocalizedCookieBanner } from '@repo/global-ui';
import { PUBLIC_BASE_URL } from '@/constants';
import './globals.css';

/* istanbul ignore next */
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS | TypeScript | Tailwind | Prisma | Clerk | OpenAI',
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const clerkLocalization = locale === 'de' ? deDE : enUS;

  return (
    <ClerkProvider
      afterSignOutUrl={PUBLIC_BASE_URL[getCurrentEnv()]}
      localization={clerkLocalization}
    >
      <html lang={locale}>
        <GoogleTagManager gtmId="GTM-N4MLTRT2" />
        <body className={`min-h-dvh bg-slate-900/25 ${inter.className}`}>
          <NextIntlClientProvider messages={messages}>
            {children}
            <LocalizedCookieBanner />
          </NextIntlClientProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
