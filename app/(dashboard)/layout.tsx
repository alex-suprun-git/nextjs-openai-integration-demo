import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const navigationLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Dashboard',
    href: '/journal',
  },
  { label: 'History', href: '/history' },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen w-screen relative">
    <aside className="absolute top-0 left-0 w-[200px] h-full border-r border-black/10">
      <div className="h-full flex flex-col">
        {navigationLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <span className="block px-6 py-4">{link.label}</span>
          </Link>
        ))}
      </div>
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
