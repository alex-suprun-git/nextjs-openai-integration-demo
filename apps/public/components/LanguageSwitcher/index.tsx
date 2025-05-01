'use client';

import { usePathname } from 'next/navigation';
import { GrLanguage } from 'react-icons/gr';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { getPageURL } from '@/app/utils';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const slug = getPageURL(pathname);

  const languages = [
    { id: 'en', label: 'English', value: `/en/${slug}` },
    { id: 'de', label: 'Deutsch', value: `/de/${slug}` },
  ];

  return (
    <div className="dropdown dropdown-hover dropdown-bottom ml-auto sm:dropdown-left">
      <div tabIndex={0} role="button" className="btn m-1 border-0 bg-slate-800 hover:bg-slate-800">
        <GrLanguage />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-[1] w-36 rounded-box bg-slate-800 p-2 shadow sm:w-40"
      >
        {languages.map((language) => {
          const isCurrentPage = language.value === `/${locale}/${slug}`;

          return (
            <li key={language.id}>
              <Link href={language.value} className="">
                {isCurrentPage ? <strong>{language.label}</strong> : language.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
