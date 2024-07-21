import { describe, it, expect, vi } from 'vitest';
import { getUserLocale, setUserLocale } from '@/utils/locales';
import { cookies } from 'next/headers';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Locale Tests', () => {
  it('should return the user locale if cookie is set', async () => {
    const mockCookies = {
      get: vi.fn().mockReturnValue({ value: 'en' }),
    };

    (cookies as any).mockReturnValue(mockCookies);

    const locale = await getUserLocale();
    expect(locale).toBe('en');
    expect(mockCookies.get).toHaveBeenCalledWith('NEXT_LOCALE');
  });

  it('should return undefined if cookie is not set', async () => {
    const mockCookies = {
      get: vi.fn().mockReturnValue(undefined),
    };

    (cookies as any).mockReturnValue(mockCookies);

    const locale = await getUserLocale();
    expect(locale).toBeUndefined();
    expect(mockCookies.get).toHaveBeenCalledWith('NEXT_LOCALE');
  });

  it('should set the user locale', async () => {
    const mockCookies = {
      set: vi.fn(),
    };

    (cookies as any).mockReturnValue(mockCookies);

    await setUserLocale('de');
    expect(mockCookies.set).toHaveBeenCalledWith('NEXT_LOCALE', 'de');
  });
});
