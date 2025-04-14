export const pageQuery = `#graphql
  query pageCollection($slug: String!, $locale: String!) {
    pageCollection(where: { slug: $slug }, locale: $locale, limit: 1) {
      items {
        _id
        title
        content {
          json
        }
      }
    }
  }
`;

export const homePageHeroQuery = `#graphql
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
