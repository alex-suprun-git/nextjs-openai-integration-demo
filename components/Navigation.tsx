'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigationLinks = [
  { label: 'Journal', href: '/journal' },
  { label: 'Statistics', href: '/statistics' },
];

const Navigation = () => {
  const path = usePathname();
  const isActive = (href: string) => path === href;

  return (
    <div className="flex">
      {navigationLinks.map((link) => (
        <Link className={isActive(link.href) ? 'font-bold' : ''} key={link.href} href={link.href}>
          <span className="mr-12 block">{link.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
