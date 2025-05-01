'use client';

import { MouseEvent } from 'react';
import { GrLanguage } from 'react-icons/gr';
import { setUserLocale } from '@/utils/locales';
import { useLocale } from 'next-intl';

const LanguageSwitcher = () => {
  const locale = useLocale();

  const languages = [
    { id: '01', label: 'English', value: 'en' },
    { id: '02', label: 'Deutsch', value: 'de' },
  ];

  const handleLanguageChange = (e: MouseEvent<HTMLAnchorElement>, language: UserLocale) => {
    e.preventDefault();
    setUserLocale(language);
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <div className="dropdown dropdown-hover dropdown-left ml-auto">
      <div tabIndex={0} role="button" className="btn m-1 border-0 bg-slate-800 hover:bg-slate-800">
        <GrLanguage />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-[1] w-36 rounded-box bg-slate-800 p-2 shadow sm:w-40"
      >
        {languages.map((language) => {
          const isCurrentLang = language.value === locale;
          return (
            <li key={language.id}>
              <a
                href="#"
                className=""
                onClick={(e) => handleLanguageChange(e, language.value as UserLocale)}
              >
                {isCurrentLang ? <strong>{language.label}</strong> : language.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
