import { FiMenu } from 'react-icons/fi';
import { UserButton } from '@clerk/nextjs';
import LanguageSwitcher from '../LanguageSwitcher';
import Navigation from '../Navigation';
import { Header, PromptCounter } from '@/ui-lib';

function Navbar() {
  return (
    <Header>
      <div className="navbar-start">
        <div className="hidden lg:flex">
          <Navigation />
        </div>
        <div className="lg:hidden">
          <FiMenu size={36} />
        </div>
      </div>
      <div className="navbar-center">
        <div className="hidden lg:block">
          <PromptCounter />
        </div>
      </div>
      <div className="navbar-end">
        <div className="mr-8 md:mr-10">
          <LanguageSwitcher />
        </div>
        <div className="pt-2 text-center">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </Header>
  );
}

export default Navbar;
