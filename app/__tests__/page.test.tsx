import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { auth } from '@clerk/nextjs/server';
import Home from '@/app/page';

// Mock the auth function from @clerk/nextjs/server
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

describe('Home', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Home page with a link to /journal if user is authenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ userId: 'test-user-id' } as any);

    render(await Home());

    await waitFor(() => {
      const linkElement = screen.getByRole('link', { name: /get started/i });
      expect(linkElement).toHaveAttribute('href', '/journal');
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
