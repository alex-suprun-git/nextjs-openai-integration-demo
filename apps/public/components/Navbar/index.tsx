'use client';

import { useRef } from 'react';
import { UserButton } from '@clerk/nextjs';
import { FiMenu } from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher';
import Navigation from '../Navigation';
import { Drawer, Header } from '@/ui-lib';

function Navbar({ publicPages }: { publicPages?: boolean }) {
  const drawerToggleRef = useRef<HTMLInputElement>(null);

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
        {!publicPages && (
          <div className="mr-8 md:mr-10">
            <LanguageSwitcher />
          </div>
        )}
        <div className="pt-2 text-center">
          <UserButton />
        </div>
      </div>
    </Header>
  );
}

export default Navbar;
