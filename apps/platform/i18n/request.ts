import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '../utils/locales';
import { headers } from 'next/headers';

async function getLocaleFromHeaders() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage) {
    const locales = acceptLanguage.split(',');
    if (locales.length > 0) {
      return locales[0].split('-')[0].split(';')[0];
    }
  }
  return 'en';
}

export default getRequestConfig(async () => {
  const defaultLocale = await getLocaleFromHeaders();
  const locale = (await getUserLocale()) || defaultLocale;

  // Supported locales
  const supportedLocales = ['en', 'de'];
  const finalLocale = supportedLocales.includes(locale) ? locale : 'en';

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  };
});
