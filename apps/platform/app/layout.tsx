import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';

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
      <head>
        <Script strategy="beforeInteractive" id="usercentrics-cmp" src="https://web.cmp.usercentrics.eu/ui/loader.js" data-settings-id="P8QhQYR7HIFVvh" async></Script>
      </head>
      <body className={`min-h-dvh bg-slate-900 ${inter.className}`}>
        <AnalyticsManager gtmId="GTM-N4MLTRT2" usercentricsServiceId="BJ59EidsWQ" />
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
