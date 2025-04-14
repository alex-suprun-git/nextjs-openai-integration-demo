import { getLocale } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';
import Hero from '@/components/Hero';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getContentFromCMS } from '@/content/utils';
import { homePageHeroQuery } from '@/content/queries';
import { HomepageHeroSchema } from '@/content/types';

const Home = async () => {
  const locale = await getLocale();
  const componentData = (await getContentFromCMS(homePageHeroQuery, locale)) as HomepageHeroSchema;
  const { userId } = await auth();

  if (!componentData) {
    console.error('Hero component data could not be fetched');
    return null;
  }

  console.log(componentData);

  const headline = componentData.homepageHeroBannerCollection.items[0].homepageHeadline;
  const description = componentData.homepageHeroBannerCollection.items[0].homepageDescription.json;

  return (
    <>
      <div className="mb-12 flex w-full px-10 pt-5">
        <LanguageSwitcher />
      </div>

      <Hero headline={headline} description={description} isAuthorized={!!userId} />
    </>
  );
};
export default Home;
