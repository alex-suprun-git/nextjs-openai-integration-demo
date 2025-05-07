export const PLATFORM_BASE_URL = {
  production: 'https://platform.nextjs-ai-platform.site/',
  development: 'http://localhost:3001/',
};

export const getPlatformUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? PLATFORM_BASE_URL.production
    : PLATFORM_BASE_URL.development;
};

export const BASE_TEXT_COLOR_HEX = '#fff';
