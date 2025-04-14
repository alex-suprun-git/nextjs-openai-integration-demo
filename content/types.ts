import { Document } from '@contentful/rich-text-types';

export type HomepageHeroSchema = {
  homepageHeroBannerCollection: {
    items: {
      homepageHeadline: string;
      homepageDescription: {
        json: Document;
      };
    }[];
  };
};

export type pageSchema = {
  pageCollection: {
    items: {
      title: string;
      content: {
        json: Document;
      };
    }[];
  };
};
