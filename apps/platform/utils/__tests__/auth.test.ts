import { describe, it, expect, vi } from 'vitest';
import { getCurrentUser } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/db';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    user: {
      findFirstOrThrow: vi.fn(),
    },
  },
}));

describe('getCurrentUser', () => {
  it('returns the user for a valid session', async () => {
    const mockEmail = 'test@example.com';
    const mockUser = { id: '1', email: mockEmail } as any;

    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { email: mockEmail } } as any);
    vi.mocked(prisma.user.findFirstOrThrow).mockResolvedValueOnce(mockUser);

    const result = await getCurrentUser();
    expect(result).toEqual(mockUser);
  });

  it('throws an error when the user is not found', async () => {
    const mockEmail = 'test@example.com';
    vi.mocked(getServerSession).mockResolvedValueOnce({ user: { email: mockEmail } } as any);

    // Create an error with the code 'P2025'
    const error = new Error('User not found') as any;
    error.code = 'P2025';

    // Mock `prisma.user.findFirstOrThrow` to throw the error
    vi.mocked(prisma.user.findFirstOrThrow).mockRejectedValueOnce(error);

    await expect(getCurrentUser()).rejects.toThrow('User not found');
  });

  it('throws an error when session fetch fails', async () => {
    const error = new Error();
    vi.mocked(getServerSession).mockRejectedValueOnce(error);

    await expect(getCurrentUser()).rejects.toThrow('An unexpected error occurred');
  });
});
