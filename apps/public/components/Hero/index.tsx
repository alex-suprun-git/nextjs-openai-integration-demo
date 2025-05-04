import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document } from '@contentful/rich-text-types';
import { getCurrentEnv } from '@repo/global-utils/helpers';
import { PLATFORM_BASE_URL } from '@/constants';

function Hero({ headline, description }: { headline: string; description: Document }) {
  const t = useTranslations('Homepage');

  return (
    <div className="flex min-h-dvh items-center justify-center bg-brand-pattern px-10 pb-24 pt-20">
      <div className="mx-auto max-w-screen-md">
        <h1 className="mb-6 break-normal text-4xl font-black leading-relaxed sm:text-6xl sm:leading-[1.25]">
          {headline}
        </h1>
        <div className="mb-12 text-xl leading-relaxed sm:text-2xl sm:leading-[1.65]">
          {documentToReactComponents(description)}
        </div>
        <div>
          <Link href={PLATFORM_BASE_URL[getCurrentEnv()]}>
            <button className="btn btn-lg mb-5 border-0 bg-yellow-200 text-gray-900 hover:bg-yellow-300">
              {t('linkText')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
