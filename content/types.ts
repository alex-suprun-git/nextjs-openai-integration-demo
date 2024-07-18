import { Document } from '@contentful/rich-text-types';

export type HeroSchemaQuery = {
  homepageHeroBannerCollection: {
    items: {
      homepageHeadline: string;
      homepageDescription: {
        json: Document;
      };
    }[];
  };
};
