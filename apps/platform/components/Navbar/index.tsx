'use client';

import { useRef } from 'react';
import { UserButton } from '@clerk/nextjs';
import { FiMenu } from 'react-icons/fi';
import LanguageSwitcher from '../LanguageSwitcher';
import Logo from '../Logo';
import Navigation from '../Navigation';
import { Drawer, Header } from '@repo/global-ui';
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
      <div className="container mx-auto flex items-center justify-between">
        <div className="navbar-start">
          <div className="hidden xl:flex">
            <Navigation />
          </div>
          <div className="xl:hidden">
            <Drawer toggleRef={drawerToggleRef} icon={<FiMenu size={38} />}>
              <Logo onClick={drawerToggleHandler} className="mb-5 mt-2 xl:hidden" />
              <Navigation onClick={drawerToggleHandler} />
              <PromptCounter />
            </Drawer>
          </div>
        </div>
        <div className="navbar-center">
          <div className="hidden lg:block">
            <PromptCounter />
          </div>
          <Logo className="hidden sm:block lg:hidden" />
        </div>
        <div className="navbar-end">
          <div className="mr-6 md:mr-12">
            <LanguageSwitcher />
          </div>

          <div className="pt-2 text-center">
            <UserButton />
          </div>
        </div>
      </div>
    </Header>
  );
}

export default Navbar;
