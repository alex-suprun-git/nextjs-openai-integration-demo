/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.nextjs-ai-platform.site',
  changefreq: 'weekly',
  alternateRefs: [
    {
      href: 'https://www.nextjs-ai-platform.site/en',
      hreflang: 'en',
    },
    {
      href: 'https://www.nextjs-ai-platform.site/de',
      hreflang: 'de',
    },
  ],
  generateIndexSitemap: false,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs.map((alternate) => {
        // No need to change the path for the default locale
        if (!hasLocaleInPath(path)) {
          return alternate;
        }

        return {
          ...alternate,
          // Note: The alternate.href already includes the locale so removing
          // the locale from the path to avoid dual locales.
          href: alternate.href + '/' + path.substring(4),
          hrefIsAbsolute: true,
        };
      }),
    };
  },
};

function hasLocaleInPath(path) {
  // Needs to change to support more locales
  const supportedLocales = ['de', 'en'];
  const pathLocale = path.substring(1, 3);
  return supportedLocales.includes(pathLocale);
}
