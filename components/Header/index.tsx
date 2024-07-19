'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaQuestionCircle } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const Header = ({
  userPromptLimit,
  userPromptUsed,
  userPromptLimitRenewal,
}: {
  userPromptLimit: string;
  userPromptUsed: string;
  userPromptLimitRenewal: string;
}) => {
  const path = usePathname();
  const isActiveLink = (href: string) => path === href;

  const t = useTranslations('Header');

  const navigationLinks = [
    { label: t('navigation.journal'), href: '/journal' },
    { label: t('navigation.statistics'), href: '/statistics' },
  ];

  return (
    <>
      <div className="mb-12 flex md:mb-0">
        {navigationLinks.map((link) => (
          <Link
            className={isActiveLink(link.href) ? 'font-bold' : ''}
            key={link.href}
            href={link.href}
          >
            <span className="mr-12 block">{link.label}</span>
          </Link>
        ))}
      </div>
      <div className="ml-auto flex flex-col items-center text-center md:mr-10 md:flex-row md:text-left">
        <p className="mr-2 leading-6">
          {t.rich('labels.promptSymbolsRemaining', {
            userPromptUsed,
            userPromptLimit,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <div
          className="tooltip tooltip-bottom mt-4 md:tooltip-left md:mt-0"
          data-tip={t('labels.promptSymbolsRenewalDate', { userPromptLimitRenewal })}
        >
          <span className="cursor-pointer">
            <FaQuestionCircle />
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
