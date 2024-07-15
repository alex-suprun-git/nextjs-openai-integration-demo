import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { POST } from '@/app/api/question/route';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { qa } from '@/utils/ai';
import { NextResponse } from 'next/server';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn().mockResolvedValue({}) as Mock,
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    journalEntry: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}));

vi.mock('@/utils/ai', () => ({
  qa: vi.fn().mockResolvedValue(''),
}));

describe('POST handler', () => {
  let jsonMock: Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Mock NextResponse.json separately
    jsonMock = vi.fn();
    NextResponse.json = jsonMock;
  });

  it('should process question, retrieve journal entries, and return answer', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ question: 'What is the meaning of life?' }),
    };

    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);

    const entries = [{ id: 'entry-1', content: 'Life is a journey.', createdAt: new Date() }];
    (prisma.journalEntry.findMany as Mock).mockResolvedValue(entries);

    const answer = 'The meaning of life is subjective.';
    (qa as Mock).mockResolvedValue(answer);

    const jsonResponse = { data: answer };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await POST(request as any);

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.findMany).toHaveBeenCalledWith({
      where: { userId: user.id },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    expect(qa).toHaveBeenCalledWith('What is the meaning of life?', entries);
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse);
    expect(response).toEqual(jsonResponse);
  });

  it('should handle errors properly', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockRejectedValue(new Error('Invalid request')),
    };

    const jsonResponse = { message: 'Error processing request' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    let error;
    try {
      await POST(request as any);
    } catch (e) {
      error = e;
    }

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).not.toHaveBeenCalled();
    expect(prisma.journalEntry.findMany).not.toHaveBeenCalled();
    expect(qa).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalledWith(jsonResponse);
    expect(error).toEqual(new Error('Invalid request'));
  });
});
