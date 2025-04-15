import { describe, it, expect, vi } from 'vitest';
import { getUserByClerkId } from '@/utils/auth';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/utils/db';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    user: {
      findFirstOrThrow: vi.fn(),
    },
  },
}));

describe('getUserByClerkId', () => {
  it('returns the user for a given Clerk ID', async () => {
    const mockUserId = 'test-user-id';
    const mockUser = { id: 1, clerkId: mockUserId, name: 'Test User' };

    // Mock the `auth` function to return a user ID
    vi.mocked(auth).mockResolvedValueOnce({ userId: mockUserId } as any);

    // Mock `prisma.user.findFirstOrThrow` to return a user
    vi.mocked(prisma.user.findFirstOrThrow).mockResolvedValueOnce(mockUser as any);

    const result = await getUserByClerkId();
    expect(result).toEqual(mockUser);
  });

  it('throws an error when the user is not found', async () => {
    const mockUserId = 'test-user-id';

    // Mock the `auth` function to return a user ID
    vi.mocked(auth).mockResolvedValueOnce({ userId: mockUserId } as any);

    // Create an error with the code 'P2025'
    const error = new Error('User not found') as any;
    error.code = 'P2025';

    // Mock `prisma.user.findFirstOrThrow` to throw the error
    vi.mocked(prisma.user.findFirstOrThrow).mockRejectedValueOnce(error);

    await expect(getUserByClerkId()).rejects.toThrow('User not found');
  });

  it('throws an error when auth fails', async () => {
    // Mock the `auth` function to throw an error
    const error = new Error();
    vi.mocked(auth).mockRejectedValueOnce(error);

    await expect(getUserByClerkId()).rejects.toThrow('An unexpected error occurred');
  });
});
