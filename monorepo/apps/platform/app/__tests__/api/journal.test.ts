import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { POST } from '@/app/api//route';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { analyzeEntry } from '@/utils/ai';
import { update } from '@/utils/actions';
import { NextResponse } from 'next/server';

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn().mockResolvedValue({}) as Mock,
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    journalEntry: {
      create: vi.fn().mockResolvedValue({}),
    },
    analysis: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('@/utils/ai', () => ({
  analyzeEntry: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/utils/actions', () => ({
  update: vi.fn(),
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

  it('should create journal entry, analyze it, save analysis, and return entry', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ content: 'This is a test entry.' }),
    };

    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);

    const entry = { id: 'entry-1', userId: user.id, content: 'This is a test entry.' };
    (prisma.journalEntry.create as Mock).mockResolvedValue(entry);

    const analysis = { sentiment: 'positive', keywords: ['test', 'entry'] };
    (analyzeEntry as Mock).mockResolvedValue(analysis);

    const analysisRecord = { userId: user.id, entryId: entry.id, ...analysis };
    (prisma.analysis.create as Mock).mockResolvedValue(analysisRecord);

    const jsonResponse = { data: entry };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await POST(request as any);

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.create).toHaveBeenCalledWith({
      data: {
        userId: user.id,
        content: 'This is a test entry.',
      },
    });
    expect(analyzeEntry).toHaveBeenCalledWith(entry.content);
    expect(prisma.analysis.create).toHaveBeenCalledWith({
      data: {
        userId: user.id,
        entryId: entry.id,
        ...analysis,
      },
    });
    expect(update).toHaveBeenCalledWith(['/']);
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
    expect(prisma.journalEntry.create).not.toHaveBeenCalled();
    expect(analyzeEntry).not.toHaveBeenCalled();
    expect(prisma.analysis.create).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalledWith(jsonResponse);
    expect(error).toEqual(new Error('Invalid request'));
  });
});
