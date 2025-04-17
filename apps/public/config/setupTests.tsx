import '@testing-library/jest-dom/vitest';

vi.mock('next-intl', async () => {
  const actual = (await vi.importActual('next-intl')) as any;

  return {
    ...actual,
    useTranslations: vi.fn(),
  };
});

vi.mock('next-intl/server', async () => {
  const actual = (await vi.importActual('next-intl/server')) as any;

  return {
    ...actual,
    getLocale: vi.fn(),
    getMessages: vi.fn(),
  };
});
