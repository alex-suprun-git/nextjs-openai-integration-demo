import { Inter } from 'next/font/google';
import '@/app/globals.css';

/* istanbul ignore next */
const inter = Inter({ subsets: ['latin'] });

const PublicPagesLayout = async ({ children }: { children: React.ReactNode }) => (
  <html lang="de">
    <body className={`min-h-dvh bg-slate-900/25 ${inter.className}`}>
      <div className="relative min-h-svh bg-gray-800">
        <div className="min-h-svh">{children}</div>
      </div>
    </body>
  </html>
);

export default PublicPagesLayout;
