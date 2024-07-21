'use client';

import { MouseEvent } from 'react';
import { GrLanguage } from 'react-icons/gr';
import { setUserLocale } from '@/utils/locales';

const LanguageSwitcher = () => {
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
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
    <div className="dropdown dropdown-left dropdown-hover ml-auto">
      <div tabIndex={0} role="button" className="btn m-1 bg-slate-800 hover:bg-slate-800">
        <GrLanguage />
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow"
      >
        {languages.map((language, index) => (
          <li key={index}>
            <a href="#" onClick={(e) => handleLanguageChange(e, language.value as UserLocale)}>
              {language.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
