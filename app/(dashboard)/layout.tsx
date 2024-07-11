import Header from '@/components/Header';
import { PromptProvider } from '@/contexts/PromptContext';
import { getUserByClerkId } from '@/utils/auth';
import { UserButton } from '@clerk/nextjs';

const getUserInfo = async () => getUserByClerkId();

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const { promptSymbolsLimit, promptSymbolsUsed } = await getUserInfo();

  return (
    <PromptProvider value={{ promptSymbolsLimit, promptSymbolsUsed }}>
      <div className="min-w-svh relative min-h-svh bg-gray-800">
        <header className="flex h-[80px] items-center border-b border-black/10 bg-gray-900">
          <div className="flex w-full pl-10">
            <Header userPromptLimit={promptSymbolsLimit} userPromptUsed={promptSymbolsUsed} />
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
