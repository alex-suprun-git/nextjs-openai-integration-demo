'use client';

import { MouseEventHandler, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '../Logo';
import { getCurrentEnv } from '@repo/global-utils/helpers';
import { PUBLIC_BASE_URL } from '@/constants';

type NavLinkType = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
};

const Navigation = ({ onClick = () => {} }: { onClick?: MouseEventHandler<HTMLAnchorElement> }) => {
  const path = usePathname();
  const isActiveLink = (href: string) => path === href;

  const t = useTranslations('Header');

  const navigationLinks = [
    { id: 'statistics', label: t('navigation.statistics'), href: '/statistics' },
    {
      id: 'aboutMe',
      label: t('navigation.aboutMe'),
      href: `${PUBLIC_BASE_URL[getCurrentEnv()]}/about-me`,
    },
  ] as NavLinkType[];

  return (
    <div className="mb-12 mt-5 flex flex-col xl:mb-0 xl:mt-0 xl:flex-row">
      <div className="flex flex-col xl:flex-row xl:items-center">
        <Logo className={'mr-16 hidden xl:block'} />
        {navigationLinks.map((link) => (
          <Link
            className={
              isActiveLink(link.href)
                ? 'mb-5 mr-12 text-2xl font-bold xl:mb-0 xl:text-base'
                : 'mb-5 mr-12 text-lg xl:mb-0 xl:text-base'
            }
            key={link.id}
            href={link.href}
            onClick={onClick}
          >
            <span className="text-stone-200">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
