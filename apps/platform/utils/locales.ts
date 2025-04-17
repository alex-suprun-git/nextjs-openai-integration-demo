'use server';

import { cookies } from 'next/headers';
import { COOKIE_NAME } from './constants';

import { getCookie, setCookie } from 'cookies-next/server';

export async function getUserLocale() {
  return getCookie(COOKIE_NAME, { cookies });
}

export async function setUserLocale(locale: UserLocale) {
  await setCookie(COOKIE_NAME, locale, { cookies });
}
