import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';

/* istanbul ignore next */
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS | TypeScript | Tailwind | Prisma | Clerk | OpenAI',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider afterSignOutUrl={'/sign-in'}>
      <html lang={locale}>
        <body className={inter.className}>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
