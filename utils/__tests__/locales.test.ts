import { describe, it, expect, vi, Mock } from 'vitest';
import { getCookie, setCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { getUserLocale, setUserLocale } from '@/utils/locales';
import { COOKIE_NAME } from '@/utils/constants';

vi.mock('cookies-next', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: {},
}));

describe('getUserLocale', () => {
  it('should get the user locale from the cookie', async () => {
    const mockLocale = 'en';
    (getCookie as Mock).mockReturnValue(mockLocale);

    const locale = await getUserLocale();

    expect(getCookie).toHaveBeenCalledWith(COOKIE_NAME, { cookies });
    expect(locale).toBe(mockLocale);
  });
});

describe('setUserLocale', () => {
  it('should set the user locale in the cookie', async () => {
    const mockLocale = 'en';

    await setUserLocale(mockLocale);

    expect(setCookie).toHaveBeenCalledWith(COOKIE_NAME, mockLocale, { cookies });
  });
});
