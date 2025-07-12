import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

import { LocalizedCookieBanner } from '@repo/global-ui';
import { AnalyticsManager } from '@repo/global-analytics';
import Providers from '@/components/Providers';
import './globals.css';

/* istanbul ignore next */
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Mood Analysis',
    default: 'Dashboard | Mood Analysis',
  },
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <AnalyticsManager gtmId="GTM-N4MLTRT2" />
      <body className={`min-h-dvh bg-slate-900 ${inter.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <LocalizedCookieBanner />
          </Providers>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
