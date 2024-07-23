import { getLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import { formatPromptData } from '@/utils/helpers';
import { PromptProvider } from '@/contexts/PromptContext';
import { getUserByClerkId } from '@/utils/auth';

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

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userInfo = await getUserInfo();
  const locale = await getLocale();

  if (!userInfo) {
    return null;
  }

  const { symbolsUsed, symbolsLimit, limitRenewalDate } = formatPromptData(userInfo, locale);

  return (
    <PromptProvider value={{ symbolsUsed, symbolsLimit, limitRenewalDate }}>
      <div className="relative min-h-svh bg-gray-800">
        <Navbar />
        <div className="min-h-svh">{children}</div>
      </div>
    </PromptProvider>
  );
};

export default DashboardLayout;
