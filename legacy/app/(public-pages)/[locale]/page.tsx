import Hero from '@/components/Hero';
import { getContentFromCMS } from '@/content/utils';
import { homePageHeroQuery } from '@/content/queries';
import { HomepageHeroSchema } from '@/content/types';

const Home = async () => {
  const componentData = (await getContentFromCMS(homePageHeroQuery, 'en')) as HomepageHeroSchema;

  if (!componentData) {
    console.error('Hero component data could not be fetched');
    return null;
  }

  const component = componentData.homepageHeroBannerCollection.items[0];

  return (
    <>
      <div className="mb-12 flex w-full px-10 pt-5">{/* lang switcher */}</div>
      <Hero
        headline={component.homepageHeadline}
        description={component.homepageDescription.json}
        isAuthorized={true}
      />
    </>
  );
};
export default Home;
