import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import { PromptProvider } from '@/contexts/PromptContext';
import { getUserByClerkId } from '@/utils/auth';
import { formatPromptData } from '@/utils/helpers';
import { Inter } from 'next/font/google';
import { redirect } from 'next/navigation';

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
  } else {
    redirect('/sign-in');
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect('/sign-in');
  }

  const { symbolsLeft, symbolsLimit, limitRenewalDate } = formatPromptData(userInfo, locale);

  return (
    <PromptProvider value={{ symbolsLeft, symbolsLimit, limitRenewalDate }}>
      <div className={`relative min-h-svh bg-gray-800 ${inter.className}`}>
        <Navbar />
        <div className="min-h-svh">{children}</div>
      </div>
    </PromptProvider>
  );
}
