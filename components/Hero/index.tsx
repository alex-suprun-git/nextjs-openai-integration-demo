import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

function Hero({
  isAuthorized,
  headline,
  description,
}: {
  isAuthorized: boolean;
  headline: string;
  description: any;
}) {
  // const t = useTranslations('HomePage');

  let href = isAuthorized ? '/journal' : '/new-user';
  // let buttonLabel = isAuthorized ? t('buttons.authorized') : t('buttons.unauthorized');

  return (
    <div className="flex items-center justify-center px-10 pb-24 text-stone-300 md:py-0">
      <div className="mx-auto max-w-screen-md">
        <h1 className="mb-6 break-normal text-5xl font-black leading-relaxed sm:text-6xl sm:leading-[1.25]">
          {headline}
        </h1>
        <div className="mb-8 text-xl leading-relaxed text-stone-300/60 sm:text-2xl sm:leading-[1.65]">
          {documentToReactComponents(description)}
        </div>
        <div>
          <Link href={href}>
            <button className="btn btn-lg mb-5 border-0 bg-yellow-200 text-gray-900 hover:bg-yellow-300">
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
