'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MouseEventHandler } from 'react';

const Navigation = ({ onClick = () => {} }: { onClick?: MouseEventHandler<HTMLAnchorElement> }) => {
  const path = usePathname();
  const isActiveLink = (href: string) => path === href;

  const t = useTranslations('Header');

  const navigationLinks = [
    { label: t('navigation.journal'), href: '/journal' },
    { label: t('navigation.statistics'), href: '/statistics' },
  ];

  return (
    <div className="mb-12 mt-5 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row">
      {navigationLinks.map((link) => (
        <Link
          className={
            isActiveLink(link.href)
              ? 'mb-5 mr-12 text-2xl font-bold lg:mb-0 lg:text-base'
              : 'mb-5 mr-12 text-lg lg:mb-0 lg:text-base'
          }
          key={link.href}
          href={link.href}
          onClick={onClick}
        >
          <span className="text-stone-300">{link.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
