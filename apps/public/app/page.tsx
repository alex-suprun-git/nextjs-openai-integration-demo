import { getLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import { getContentFromCMS } from '@/content/utils';
import { homePageHeroQuery } from '@/content/queries';
import { HomepageHeroSchema } from '@/content/types';

const Home = async () => {
  const locale = await getLocale();
  const componentData = (await getContentFromCMS(homePageHeroQuery, locale)) as HomepageHeroSchema;

  if (!componentData) {
    console.error('Hero component data could not be fetched');
    return null;
  }

  const component = componentData.homepageHeroBannerCollection.items[0];
  const headline = component?.homepageHeadline;
  const description = component?.homepageDescription.json;

  return <>{headline && description && <Hero headline={headline} description={description} />}</>;
};
export default Home;
