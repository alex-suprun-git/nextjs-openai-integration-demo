import { contentGQLQuery } from './fetch';
import { HeroSchemaQuery } from './types';

export const getContentForHero = async () => {
  const query = `#graphql
    query HeroCollection {
        homepageHeroBannerCollection {
            items {
                homepageHeadline
                homepageDescription {
                    json
                }
            }
        }
    }
`;
  const data = await contentGQLQuery<HeroSchemaQuery>({ query });

  if (!data) {
    console.error('Error fetching hero content');
  }

  return data;
};
