'use client';

import { useRef } from 'react';
import { UserButton } from '@clerk/nextjs';
import { FiMenu } from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher';
import Navigation from '../Navigation';
import { Drawer, Header } from '@repo/ui/index';
import PromptCounter from '@/ui-lib/PromptCounter';

function Navbar() {
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
            <PromptCounter />
          </Drawer>
        </div>
      </div>
      <div className="navbar-center">
        <div className="hidden lg:block">
          <PromptCounter />
        </div>
      </div>
      <div className="navbar-end">
        <div className="mr-6 md:mr-12">
          <LanguageSwitcher />
        </div>

        <div className="pt-2 text-center">
          <UserButton />
        </div>
      </div>
    </Header>
  );
}

export default Navbar;
