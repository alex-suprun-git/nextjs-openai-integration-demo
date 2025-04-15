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

export type PageSchema = {
  pageCollection: {
    items: {
      title: string;
      content: {
        json: Document;
      };
      hasImage: boolean;
      image: {
        width: number;
        height: number;
        url: string;
        description: string;
      };
    }[];
  };
};
