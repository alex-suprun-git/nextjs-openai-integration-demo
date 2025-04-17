import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from '@/components/Navbar';
import { Inter } from 'next/font/google';
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

  return (
    <html lang={locale}>
      <body className={`min-h-dvh bg-slate-900/25 ${inter.className}`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <div className="mt-20">{children}</div>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
