import Link from 'next/link';
import Image from 'next/image';
import { MouseEventHandler } from 'react';
import logo from '@/public/assets/logo.png';

function Logo({
  onClick,
  className,
}: {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className: string;
}) {
  return (
    <Link onClick={onClick} href={'/'} className={className}>
      <Image src={logo} width={120} height={50} priority={true} alt="logo" />
    </Link>
  );
}

export default Logo;
