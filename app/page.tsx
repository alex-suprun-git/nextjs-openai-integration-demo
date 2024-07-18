import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { getContentForHero } from '@/content/queries';

const Home = async () => {
  const { userId } = await auth();

  const componentData = await getContentForHero();

  if (!componentData) {
    console.error('Hero component data could not be fetched');
    return null;
  }

  const headline = componentData.homepageHeroBannerCollection.items[0].homepageHeadline;
  const description = componentData.homepageHeroBannerCollection.items[0].homepageDescription.json;

  let href = userId ? '/journal' : '/new-user';
  let buttonLabel = userId ? 'Go to Journal' : 'Get Started';

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
};
export default Home;
