import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { PATCH } from '@/app/api/user/route';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { NextResponse } from 'next/server';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn() as Mock,
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn() as Mock,
      update: vi.fn() as Mock,
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
      json: vi.fn().mockResolvedValue({ promptContentLength: 100 }),
    };

    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);
    (prisma.user.findUnique as Mock).mockResolvedValue({ promptSymbolsUsed: 50 });
    (prisma.user.update as Mock).mockResolvedValue({});

    const jsonResponse = { message: 'User updated successfully' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await PATCH(request as any);

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
      select: { promptSymbolsUsed: true },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: { promptSymbolsUsed: 150 }, // 50 (current) + 100 (new)
    });
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse);
    expect(response).toEqual(jsonResponse);
  });

  it('should return 401 if user not found', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ promptContentLength: 100 }),
    };

    (getUserByClerkId as Mock).mockResolvedValue(null);

    const jsonResponse = { message: 'User not found' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await PATCH(request as any);

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse, { status: 401 });
    expect(response).toEqual(jsonResponse);
  });

  it('should return 404 if user not found in database', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ promptContentLength: 100 }),
    };

    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);
    (prisma.user.findUnique as Mock).mockResolvedValue(null);

    const jsonResponse = { message: 'User not found in database' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await PATCH(request as any);

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
      select: { promptSymbolsUsed: true },
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse, { status: 404 });
    expect(response).toEqual(jsonResponse);
  });
});
