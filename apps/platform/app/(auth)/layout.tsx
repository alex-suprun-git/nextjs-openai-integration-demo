import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className={`min-h-screen bg-gray-800 ${inter.className}`}>{children}</div>;
}
