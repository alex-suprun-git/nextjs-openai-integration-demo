import Navigation from '@/components/Navigation';
import { UserButton } from '@clerk/nextjs';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-svh relative min-h-svh bg-gray-800">
    <header className="flex h-[80px] items-center border-b border-black/10 bg-gray-900">
      <div className="pl-10">
        <Navigation />
      </div>
      <div className="ml-auto flex pr-10">
        <UserButton />
      </div>
    </header>
    <div className="min-h-svh">{children}</div>
  </div>
);
export default DashboardLayout;
