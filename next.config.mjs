import createNextIntlPlugin from 'next-intl/plugin';
import withPWA from 'next-pwa';

const withNextIntl = createNextIntlPlugin();
const withPWAConfig = withPWA({dest: 'public'});

/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: true,
};

export default withPWAConfig(withNextIntl(nextConfig));

