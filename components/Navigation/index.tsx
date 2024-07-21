'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navigation = () => {
  const path = usePathname();
  const isActiveLink = (href: string) => path === href;

  const t = useTranslations('Header');

  const navigationLinks = [
    { label: t('navigation.journal'), href: '/journal' },
    { label: t('navigation.statistics'), href: '/statistics' },
  ];

  return (
    <div className="mb-5 md:mb-0">
      {navigationLinks.map((link) => (
        <Link
          className={isActiveLink(link.href) ? 'mr-12 font-bold' : 'mr-12'}
          key={link.href}
          href={link.href}
        >
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
