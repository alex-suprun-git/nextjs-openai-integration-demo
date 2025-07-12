'use client';

import { useRef, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher';
import Logo from '../Logo';
import Navigation from '../Navigation';
import Modal from '../Modal';
import { Drawer, Header } from '@repo/global-ui';
import PromptCounter from '@/ui-lib/PromptCounter';

function Navbar() {
  const { data: session } = useSession();
  const drawerToggleRef = useRef<HTMLInputElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const t = useTranslations('Global.logout');

  const drawerToggleHandler = () => {
    if (drawerToggleRef.current) {
      drawerToggleRef.current.checked = false;
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    signOut();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
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

          <div className="text-center">
            <button
              className="btn bg-red-800 hover:bg-red-900"
              onClick={handleLogoutClick}
              aria-label={t('ariaLabel')}
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        title=""
        confirmButton={{
          label: t('confirmButton'),
          onClick: handleLogoutConfirm,
          className: 'bg-red-800 hover:bg-red-900',
        }}
        cancelButton={{
          label: t('cancelButton'),
        }}
      >
        {t('confirmationMessage')}
      </Modal>
    </Header>
  );
}

export default Navbar;
