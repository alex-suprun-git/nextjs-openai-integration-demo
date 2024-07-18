import { getContentForHero } from '@/content/queries';
import Hero from '@/components/Hero';
import { auth } from '@clerk/nextjs/server';
import { getLocale } from 'next-intl/server';

const Home = async () => {
  const locale = await getLocale();
  const componentData = await getContentForHero(locale);
  const { userId } = await auth();

  if (!componentData) {
    console.error('Hero component data could not be fetched');
    return null;
  }

  const headline = componentData.homepageHeroBannerCollection.items[0].homepageHeadline;
  const description = componentData.homepageHeroBannerCollection.items[0].homepageDescription.json;

  return <Hero headline={headline} description={description} isAuthorized={!!userId} />;
};
export default Home;
