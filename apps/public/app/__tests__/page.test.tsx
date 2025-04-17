import { render, screen, waitFor } from '@testing-library/react';
import { createTranslator, useTranslations } from 'next-intl';
import { Mock, vi } from 'vitest';
import { auth } from '@clerk/nextjs/server';
import Home from '@/app/page';
import { getContentFromCMS } from '@/content/utils';
import heroContentMock from '@/app/__tests__/__mocks__/heroContentMock.json';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('@/content/utils', () => ({
  getContentFromCMS: vi.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.mocked(getContentFromCMS as Mock).mockResolvedValue(heroContentMock);
  });

  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'HomePage',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Home page with a link to / if user is authenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ userId: 'test-user-id' } as any);

    render(await Home());

    await waitFor(() => {
      const linkElement = screen.getByRole('link', { name: /go to journal/i });
      expect(linkElement).toHaveAttribute('href', '/');
    });
  });

  it('renders the Home page with a link to /new-user if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any);

    render(await Home());

    await waitFor(() => {
      const linkElement = screen.getByRole('link', { name: /get started/i });
      expect(linkElement).toHaveAttribute('href', '/new-user');
    });
  });

  it('renders the main elements correctly', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as any);

    render(await Home());

    await waitFor(() => {
      expect(screen.getByText('AI-Powered Mood Analysis')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/This demo application, built with NextJS/i)).toBeInTheDocument();
    });
  });
});
