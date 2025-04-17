'use client';

import { MouseEvent } from 'react';
import { GrLanguage } from 'react-icons/gr';

const LanguageSwitcher = () => {
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
  ];

  const handleLanguageChange = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  };

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
            <a href="#" className="text-stone-300" onClick={(e) => handleLanguageChange(e)}>
              {language.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
