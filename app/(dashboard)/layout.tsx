import { FC } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const DashboardLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-screen w-screen relative">
    <aside className="absolute top-0 left-0 w-[200px] h-full border-r border-black/10">
      <Link href="/journal">Dashboard</Link>
    </aside>
    <div className="ml-[200px] h-full">
      <header className="h-[60px] border-b border-black/10">
        <div className="h-full w-full px-6 flex items-center justify-end">
          <UserButton />
        </div>
      </header>
      <div className="h-[calc(100vh-60px)]">{children}</div>
    </div>
  </div>
);
export default DashboardLayout;
