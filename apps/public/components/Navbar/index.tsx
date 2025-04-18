'use client';

import { useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiMenu } from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher';
import Navigation from '../Navigation';
import { Drawer, Header } from '@/ui-lib';
import { PLATFORM_BASE_URL } from '@/constants';
import { fetcher } from '@/app/utils';

function Navbar() {
  const drawerToggleRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Header');

  const { data, error } = useSWR('/api/auth/status', fetcher, {
    revalidateOnFocus: true,
  });

  if (!data || error) return null;

  const { isSignedIn } = data;

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
            <Navigation onClick={drawerToggleHandler} />
          </Drawer>
        </div>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <div className="flex items-center text-center">
          <div className="mr-6 md:mr-12">
            <LanguageSwitcher />
          </div>
          <Link
            className="btn bg-yellow-200 text-lg font-bold text-gray-900 hover:bg-yellow-300"
            href={PLATFORM_BASE_URL}
          >
            {isSignedIn ? t('navigation.toPlatform') : t('navigation.logIn')}
          </Link>
        </div>
      </div>
    </Header>
  );
}

export default Navbar;
