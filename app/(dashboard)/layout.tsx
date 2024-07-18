import Header from '@/components/Header';
import { PromptProvider } from '@/contexts/PromptContext';
import { getUserByClerkId } from '@/utils/auth';
import { formatDate } from '@/utils/helpers';
import { UserButton } from '@clerk/nextjs';

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

  if (!userInfo) {
    return null;
  }

  const { promptSymbolsLimit, promptSymbolsUsed, promptSymbolsLimitRenewal } = userInfo;

  const formattedSymbolsLeft = new Intl.NumberFormat().format(
    promptSymbolsLimit - promptSymbolsUsed,
  );
  const formattedSymbolsLimit = new Intl.NumberFormat().format(promptSymbolsLimit);
  const userPromptLimitRenewal = formatDate(promptSymbolsLimitRenewal);

  return (
    <PromptProvider value={{ promptSymbolsLimit, promptSymbolsUsed }}>
      <div className="min-w-svh relative min-h-svh bg-gray-800">
        <header className="flex items-start border-b border-black/10 bg-gray-900 py-5 md:h-[80px] md:items-center md:py-0">
          <div className="flex flex-col pl-10 md:w-full md:flex-row">
            <Header
              userPromptLimit={formattedSymbolsLimit}
              userPromptUsed={formattedSymbolsLeft}
              userPromptLimitRenewal={userPromptLimitRenewal}
            />
          </div>
          <div className="ml-auto flex pr-10">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>
        <div className="min-h-svh">{children}</div>
      </div>
    </PromptProvider>
  );
};

export default DashboardLayout;
