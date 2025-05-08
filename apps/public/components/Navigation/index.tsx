'use client';

import { MouseEventHandler, ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Logo from '../Logo';
import { BASE_TEXT_COLOR_HEX } from '@/constants';

type NavLinkType = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
};

const Navigation = ({ onClick = () => {} }: { onClick?: MouseEventHandler<HTMLAnchorElement> }) => {
  const path = usePathname();
  const locale = useLocale();
  const isActiveLink = (href: string) => path === href;

  const t = useTranslations('Header');

  const navigationLinks = [
    { id: 'aboutMe', label: t('navigation.aboutMe'), href: `/${locale}/about-me` },
    {
      id: 'gitHub',
      label: t('navigation.gitHub'),
      href: `https://github.com/alex-suprun-git/nextjs-openai-integration-demo`,
      icon: <FaGithub fill={BASE_TEXT_COLOR_HEX} />,
      external: true,
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
                ? 'mb-5 mr-10 text-2xl font-bold xl:mb-0 xl:text-base'
                : 'mb-5 mr-10 text-lg xl:mb-0 xl:text-base'
            }
            key={link.id}
            href={link.href}
            target={!!link?.external ? '_blank' : '_self'}
            onClick={onClick}
          >
            <div className="flex items-center">
              {!!link?.icon && <span className="mr-1.5">{link.icon}</span>}
              <span className="">{link.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
