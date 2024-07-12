import Header from '@/components/Header';
import { PromptProvider } from '@/contexts/PromptContext';
import { getUserByClerkId } from '@/utils/auth';
import { UserButton } from '@clerk/nextjs';

const getUserInfo = async () => getUserByClerkId();

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { promptSymbolsLimit, promptSymbolsUsed } = await getUserInfo();

  const formattedSymbolsLeft = new Intl.NumberFormat().format(
    promptSymbolsLimit - promptSymbolsUsed,
  );
  const formattedSymbolsLimit = new Intl.NumberFormat().format(promptSymbolsLimit);

  return (
    <PromptProvider value={{ promptSymbolsLimit, promptSymbolsUsed }}>
      <div className="min-w-svh relative min-h-svh bg-gray-800">
        <header className="flex items-start border-b border-black/10 bg-gray-900 py-5 md:h-[80px] md:items-center md:py-0">
          <div className="flex flex-col pl-10 md:w-full md:flex-row">
            <Header userPromptLimit={formattedSymbolsLimit} userPromptUsed={formattedSymbolsLeft} />
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
