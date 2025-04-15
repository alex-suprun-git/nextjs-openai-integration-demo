import { screen, render, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import NewUserPage from '@/app/new-user/page';
import Loading from '@/app/new-user/loading';
import { prisma } from '@/utils/db';

vi.mock('@/utils/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  currentUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Utility function to remove milliseconds
function toISOStringWithoutMs(date: Date): string {
  return `${date.toISOString().split('.')[0]}Z`;
}

describe('NewUserPage', () => {
  beforeAll(() => {
    // Mock system time
    vi.setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
  });

  afterAll(() => {
    // Restore real system time
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const now = new Date('2022-01-01T00:00:00.000Z');
  const nextRenewalDate = new Date(now.setMonth(now.getMonth() + 1));

  const mockPrismaUser = {
    id: '123',
    createdAt: now,
    updatedAt: now,
    clerkId: '123',
    email: 'test@example.com',
    promptSymbolsUsed: 0,
    promptSymbolsLimit: 100,
    promptSymbolsLimitRenewal: nextRenewalDate,
  };

  const mockClerkUser = { id: '123', emailAddresses: [{ emailAddress: 'test@example.com' }] };

  it('redirects to /journal if the user already exists', async () => {
    vi.mocked(currentUser).mockResolvedValueOnce(mockClerkUser as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockPrismaUser);

    render(await NewUserPage());

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/journal');
    });
  });

  it('creates a new user and redirects to /journal if the user does not exist', async () => {
    vi.mocked(currentUser).mockResolvedValueOnce(mockClerkUser as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce(null);
    vi.mocked(prisma.user.create).mockResolvedValueOnce(mockPrismaUser);

    render(await NewUserPage());

    await waitFor(() => {
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          clerkId: '123',
          email: 'test@example.com',
          promptSymbolsLimitRenewal: nextRenewalDate,
        },
      });
    });

    await waitFor(() => {
      // Extract the actual date used in the call
      const actualDate = (prisma.user.create as Mock).mock.calls[0][0].data
        .promptSymbolsLimitRenewal;
      const expectedDate = nextRenewalDate;

      expect(toISOStringWithoutMs(actualDate)).toBe(toISOStringWithoutMs(expectedDate));
    });

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/journal');
    });
  });
});

describe('Loading', () => {
  it('renders the Loading component correctly', () => {
    render(<Loading />);

    // Check if the Loading component is rendered
    const loadingElement = screen.getByTestId('loading-ui-component');
    expect(loadingElement).toBeInTheDocument();

    // Check if the Loading component has the correct class
    expect(loadingElement).toHaveClass('loading loading-lg');
  });
});
