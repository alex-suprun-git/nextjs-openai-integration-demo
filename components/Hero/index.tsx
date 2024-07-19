'use client';

import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useTranslations } from 'next-intl';

function Hero({
  isAuthorized,
  headline,
  description,
}: {
  isAuthorized: boolean;
  headline: string;
  description: any;
}) {
  const t = useTranslations('HomePage');

  let href = isAuthorized ? '/journal' : '/new-user';
  let buttonLabel = isAuthorized ? t('buttons.authorized') : t('buttons.unauthorized');

  return (
    <div className="bg-slate-550 flex min-h-svh items-center justify-center p-10 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-5xl font-black leading-relaxed sm:text-6xl sm:leading-[1.25]">
          {headline}
        </h1>
        <div className="mb-8 text-xl leading-relaxed text-white/60 sm:text-2xl sm:leading-[1.65]">
          {documentToReactComponents(description)}
        </div>
        <div>
          <Link href={href}>
            <button className="btn btn-lg bg-blue-600 text-white hover:bg-blue-800">
              {buttonLabel}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
