'use client';

import { usePathname } from 'next/navigation';
import { GrLanguage } from 'react-icons/gr';
import { getPageURL } from '@/app/utils';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const slug = getPageURL(pathname);

  const languages = [
    { label: 'English', value: `/en/${slug}` },
    { label: 'Deutsch', value: `/de/${slug}` },
  ];

  return (
    <div className="dropdown dropdown-hover dropdown-left ml-auto">
      <div
        tabIndex={0}
        role="button"
        className="btn m-1 border-0 bg-slate-800 text-stone-300 hover:bg-slate-800"
      >
        <GrLanguage />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-[1] w-52 rounded-box bg-slate-800 p-2 shadow"
      >
        {languages.map((language, index) => (
          <li key={index}>
            <Link href={language.value} className="text-stone-300">
              {language.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
