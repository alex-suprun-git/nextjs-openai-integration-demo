import Hero from '@/components/Hero';
import { getContentFromCMS } from '@/content/utils';
import { homePageHeroQuery } from '@/content/queries';
import { HomepageHeroSchema } from '@/content/types';
import { setRequestLocale } from 'next-intl/server';

const HomePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const componentData = (await getContentFromCMS(homePageHeroQuery, locale)) as HomepageHeroSchema;

  console.log(componentData);
  if (!componentData) {
    const msg = 'Hero component data could not be fetched (Contentful).';
    console.error(msg);
    if (process.env.CI) throw new Error(msg);
    return null;
  }

  const component = componentData.homepageHeroBannerCollection.items[0];
  const headline = component?.homepageHeadline;
  const description = component?.homepageDescription.json;

  return <>{headline && description && <Hero headline={headline} description={description} />}</>;
};
export default HomePage;
