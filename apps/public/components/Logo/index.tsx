import Link from 'next/link';
import Image from 'next/image';
import { MouseEventHandler } from 'react';

function Logo({
  onClick,
  className,
}: {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className: string;
}) {
  return (
    <Link onClick={onClick} href={'/'} className={className}>
      <Image
        src={'/assets/logo.png'}
        width={120}
        height={50}
        quality={100}
        priority={true}
        alt="logo"
      />
    </Link>
  );
}

export default Logo;
