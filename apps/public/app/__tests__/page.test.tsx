// app/__tests__/HomePage.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import HomePage from '@/app/[locale]/page';
import { getContentFromCMS } from '@/content/utils';
import { homePageHeroQuery } from '@/content/queries';
import { setRequestLocale } from 'next-intl/server';

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
}));

vi.mock('@/content/utils', () => ({
  getContentFromCMS: vi.fn(),
}));

vi.mock('@/components/Hero', () => ({
  __esModule: true,
  default: ({ headline, description }: { headline: string; description: any }) => (
    <div data-testid="hero">
      <h1>{headline}</h1>
      <div>{JSON.stringify(description)}</div>
    </div>
  ),
}));

describe('HomePage (mocked)', () => {
  const fakeData = {
    homepageHeroBannerCollection: {
      items: [
        {
          homepageHeadline: 'Test Headline',
          homepageDescription: { json: [{ type: 'p', children: [{ text: 'Test' }] }] },
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders <Hero> with fetched data', async () => {
    (getContentFromCMS as any).mockResolvedValue(fakeData);

    const element = await HomePage({
      params: Promise.resolve({ locale: 'en' }),
    });

    render(element!);

    expect(setRequestLocale).toHaveBeenCalledWith('en');
    expect(getContentFromCMS).toHaveBeenCalledWith(homePageHeroQuery, 'en');
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
  });

  it('throws in CI and logs errors without fetched data', async () => {
    const msg = 'Hero component data could not be fetched (Contentful).';
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const originalCI = process.env.CI;

    process.env.CI = 'true';
    (getContentFromCMS as any).mockResolvedValue(null);

    await expect(HomePage({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow(msg);

    expect(errorSpy).toHaveBeenCalledWith(msg);

    if (typeof originalCI === 'undefined') delete process.env.CI;
    else process.env.CI = originalCI;
  });
});
