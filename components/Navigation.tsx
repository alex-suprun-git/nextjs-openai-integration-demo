'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PROMPT_SYMBOLS_LIMIT = 10000;

const navigationLinks = [
  { label: 'Journal', href: '/journal' },
  { label: 'Statistics', href: '/statistics' },
];

const Navigation = () => {
  const promptSymbolsLeft = PROMPT_SYMBOLS_LIMIT - 0;

  const path = usePathname();
  const isActive = (href: string) => path === href;

  return (
    <>
      <div className="flex">
        {navigationLinks.map((link) => (
          <Link className={isActive(link.href) ? 'font-bold' : ''} key={link.href} href={link.href}>
            <span className="mr-12 block">{link.label}</span>
          </Link>
        ))}
      </div>
      <div className="ml-auto mr-10 flex">
        <p>
          You have {promptSymbolsLeft} out of {PROMPT_SYMBOLS_LIMIT} prompt symbols left
        </p>
      </div>
    </>
  );
};

export default Navigation;
