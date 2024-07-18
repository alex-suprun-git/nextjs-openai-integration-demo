import { contentGQLQuery } from './fetch';
import { HeroSchemaQuery } from './types';

export const getContentForHero = async (locale: string) => {
  const query = `#graphql
    query HeroCollection($locale: String!) {
      homepageHeroBannerCollection(locale: $locale) {
        items {
          homepageHeadline
          homepageDescription {
            json
          }
        }
      }
    }
  `;

  const variables = { locale };

  try {
    const data = await contentGQLQuery<HeroSchemaQuery>({ query, variables });

    if (!data) {
      throw new Error('Error fetching hero content');
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
