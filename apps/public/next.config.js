import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin();
const withPWAConfig = withPWA({ dest: 'public' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone mode for Lambda
  serverExternalPackages: [
    'require-in-the-middle',
    '@opentelemetry/instrumentation',
    '@sentry/node',
    '@sentry/core',
  ],
  compress: false, // CloudFront handles compression
  trailingSlash: true, // Enforce trailing slashes on all routes
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [new URL('https://images.ctfassets.net/**')],
    unoptimized: true, // Lambda doesn't support sharp for image optimization
  },
  async rewrites() {
    return [
      {
        source: '/api/c15t/:path*',
        destination: `${process.env.NEXT_PUBLIC_C15T_URL}/:path*`,
      },
    ];
  },
};

export default withSentryConfig(withPWAConfig(withNextIntl(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'oleksii-suprun',
  project: 'nextjs-ai-integration-public',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
