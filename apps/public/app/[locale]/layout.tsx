import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Inter } from 'next/font/google';

import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import { AnalyticsManager } from '@repo/global-analytics';
import '@/app/globals.css';

/* istanbul ignore next */
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS | TypeScript | Tailwind | Prisma | OpenAI',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/icons/favicon.ico',
    apple: '/assets/icons/apple-touch-icon.png',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <Script strategy="beforeInteractive" id="usercentrics-cmp" src="https://web.cmp.usercentrics.eu/ui/loader.js" data-settings-id="P8QhQYR7HIFVvh" async />
      </head>
      <body className={`min-h-dvh bg-slate-900 ${inter.className}`}>
        <AnalyticsManager gtmId="GTM-N4MLTRT2" usercentricsServiceId="BJ59EidsWQ" />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
