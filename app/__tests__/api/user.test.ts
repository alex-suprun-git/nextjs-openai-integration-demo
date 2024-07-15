import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { PATCH } from '@/app/api/user/route';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn().mockResolvedValue({}) as Mock,
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    user: {
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('PATCH handler', () => {
  let jsonMock: Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Mock NextResponse.json separately
    jsonMock = vi.fn();
    NextResponse.json = jsonMock;
  });

  it('should update user and return success message', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ promptSymbolsUsed: 100 }),
    };

    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);

    (prisma.user.update as Mock).mockResolvedValue({});

    const jsonResponse = { message: 'User updated successfully' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await PATCH(request as any);

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { promptSymbolsUsed: 100 },
    });
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse);
    expect(response).toEqual(jsonResponse);
  });

  it('should handle errors properly', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockRejectedValue(new Error('Invalid request')),
    };

    const jsonResponse = { message: 'Error updating user' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    let error;
    try {
      await PATCH(request as any);
    } catch (e) {
      error = e;
    }

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalledWith(jsonResponse);
    expect(error).toEqual(new Error('Invalid request'));
  });
});
