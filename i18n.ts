import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

function getLocaleFromHeaders() {
  const headersList = headers();
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
  const locale = getLocaleFromHeaders();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
