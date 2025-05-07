'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiMenu } from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher';
import Logo from '../Logo';
import Navigation from '../Navigation';
import { Drawer, Header } from '@repo/global-ui';
import { getPlatformUrl } from '@/constants';

function Navbar() {
  const drawerToggleRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Header');

  const drawerToggleHandler = () => {
    if (drawerToggleRef.current) {
      drawerToggleRef.current.checked = false;
    }
  };

  return (
    <Header>
      <div className="navbar-start">
        <div className="hidden xl:flex">
          <Navigation />
        </div>
        <div className="xl:hidden">
          <Drawer toggleRef={drawerToggleRef} icon={<FiMenu size={38} />}>
            <Logo onClick={drawerToggleHandler} className={'mb-5 mt-2 lg:hidden'} />
            <Navigation onClick={drawerToggleHandler} />
          </Drawer>
        </div>
      </div>
      <div className="navbar-center">
        <Logo className={'hidden lg:block xl:hidden'} />
      </div>
      <div className="navbar-end">
        <div className="flex items-center text-center">
          <div className="mr-6 md:mr-12">
            <LanguageSwitcher />
          </div>
          <Link
            className="toLogInLink btn bg-yellow-200 text-lg font-bold text-gray-900 hover:bg-yellow-300"
            href={getPlatformUrl()}
          >
            {t('navigation.toPlatform')}
          </Link>
        </div>
      </div>
    </Header>
  );
}

export default Navbar;
