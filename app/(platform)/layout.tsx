import Navbar from '@/components/Navbar';
import { formatPromptData } from '@/utils/helpers';
import { PromptProvider } from '@/contexts/PromptContext';
import { getUserByClerkId } from '@/utils/auth';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { deDE, enUS } from '@clerk/localizations';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

/* istanbul ignore next */
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS | TypeScript | Tailwind | Prisma | Clerk | OpenAI',
  manifest: '/manifest.json',
};

const getUserInfo = async () => {
  const user = await getUserByClerkId();
  if (user) {
    return {
      promptSymbolsLimit: user.promptSymbolsLimit,
      promptSymbolsUsed: user.promptSymbolsUsed,
      promptSymbolsLimitRenewal: user.promptSymbolsLimitRenewal,
    };
  }
  return null;
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUserInfo();
  const locale = await getLocale();

  if (!userInfo) {
    return null;
  }

  const { symbolsUsed, symbolsLimit, limitRenewalDate } = formatPromptData(userInfo, locale);

  const messages = await getMessages();
  const clerkLocalization = locale === 'de' ? deDE : enUS;

  return (
    <ClerkProvider afterSignOutUrl={'/sign-in'} localization={clerkLocalization}>
      <html lang={locale}>
        <body className={`min-h-dvh bg-slate-900/25 ${inter.className}`}>
          <NextIntlClientProvider messages={messages}>
            <PromptProvider value={{ symbolsUsed, symbolsLimit, limitRenewalDate }}>
              <div className="relative min-h-svh bg-gray-800">
                <Navbar />
                <div className="min-h-svh">{children}</div>
              </div>
            </PromptProvider>
          </NextIntlClientProvider>
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
