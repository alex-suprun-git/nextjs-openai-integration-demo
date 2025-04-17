import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { PATCH, DELETE } from '@/app/api//[id]/route';
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
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    analysis: {
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('@/utils/ai', () => ({
  analyzeEntry: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/utils/actions', () => ({
  update: vi.fn(),
}));

vi.mock('next/dist/client/components/hooks-server-context', () => ({
  isDynamicServerError: vi.fn(),
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

  it('should update journal entry, analyze it, save analysis, and return updated entry with analysis', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ content: 'Updated content' }),
    };

    const asyncParams = Promise.resolve({ id: 'entry-123' });
    const { id } = await asyncParams;

    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);

    const updatedEntry = { id, userId: user.id, content: 'Updated content' };
    (prisma.journalEntry.update as Mock).mockResolvedValue(updatedEntry);

    const analysis = { sentiment: 'neutral', keywords: ['updated', 'content'] };
    (analyzeEntry as Mock).mockResolvedValue(analysis);

    const updatedAnalysis = { userId: user.id, entryId: updatedEntry.id, ...analysis };
    (prisma.analysis.upsert as Mock).mockResolvedValue(updatedAnalysis);

    const jsonResponse = { data: { ...updatedEntry, analysis: updatedAnalysis } };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await PATCH(request as any, { params: asyncParams });

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.update).toHaveBeenCalledWith({
      where: {
        userId_id: {
          userId: user.id,
          id,
        },
      },
      data: {
        content: 'Updated content',
      },
    });
    expect(analyzeEntry).toHaveBeenCalledWith(updatedEntry.content);
    expect(prisma.analysis.upsert).toHaveBeenCalledWith({
      where: {
        entryId: updatedEntry.id,
      },
      create: {
        userId: user.id,
        entryId: updatedEntry.id,
        ...analysis,
      },
      update: analysis,
    });
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse);
    expect(response).toEqual(jsonResponse);
  });

  it('should handle errors properly', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockRejectedValue(new Error('Invalid request')),
    };

    const params = Promise.resolve({ id: 'entry-123' });
    const jsonResponse = { message: 'Error processing request' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    let error;
    try {
      await PATCH(request as any, { params });
    } catch (e) {
      error = e;
    }

    // Assert
    expect(request.json).toHaveBeenCalled();
    expect(getUserByClerkId).not.toHaveBeenCalled();
    expect(prisma.journalEntry.update).not.toHaveBeenCalled();
    expect(analyzeEntry).not.toHaveBeenCalled();
    expect(error).toEqual(new Error('Invalid request'));
  });

  it('should return 401 when the user is not found', async () => {
    // Arrange
    const request = {
      json: vi.fn().mockResolvedValue({ content: 'Updated content' }),
    };

    const asyncParams = Promise.resolve({ id: 'entry-123' });
    (getUserByClerkId as Mock).mockResolvedValue(null); // Mock getUserByClerkId to return null

    const jsonResponse = { message: 'User not found' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    let response;
    try {
      response = await PATCH(request as any, { params: asyncParams });
    } catch (error) {
      response = error;
    }

    // Assert
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.update).not.toHaveBeenCalled();
    expect(analyzeEntry).not.toHaveBeenCalled();
    expect(prisma.analysis.upsert).not.toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse, { status: 401 });
    expect(response).toEqual(jsonResponse);
  });
});

describe('DELETE handler', () => {
  let jsonMock: Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Mock NextResponse.json separately
    jsonMock = vi.fn();
    NextResponse.json = jsonMock;

    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should delete journal entry and return deleted entry id', async () => {
    // Arrange
    const request = {}; // DELETE request does not have a body

    const asyncParams = Promise.resolve({ id: 'entry-123' });
    const { id } = await asyncParams;
    const user = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(user);

    const jsonResponse = { data: { id } };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    const response = await DELETE(request as any, { params: asyncParams });

    // Assert
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.delete).toHaveBeenCalledWith({
      where: {
        userId_id: {
          id,
          userId: user.id,
        },
      },
    });
    expect(update).toHaveBeenCalledWith(['/']);
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse);
    expect(response).toEqual(jsonResponse);
  });

  it('should handle general errors properly', async () => {
    // Arrange
    const request = {}; // DELETE request does not have a body
    const asyncParams = Promise.resolve({ id: 'entry-123' });

    const jsonResponse = { message: 'Error processing request' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    let response;
    try {
      response = await DELETE(request as any, { params: asyncParams });
    } catch (e) {
      response = e;
    }

    // Assert
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.delete).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(response).toEqual(jsonResponse);
  });

  it('should return 401 when the user is not found', async () => {
    // Arrange
    const request = {}; // DELETE request does not have a body
    const params = Promise.resolve({ id: 'entry-123' });
    (getUserByClerkId as Mock).mockResolvedValue(null); // Mock getUserByClerkId to return null

    const jsonResponse = { message: 'User not found' };
    jsonMock.mockReturnValue(jsonResponse);

    // Act
    let response;
    try {
      response = await DELETE(request as any, { params });
    } catch (error) {
      response = error;
    }

    // Assert
    expect(getUserByClerkId).toHaveBeenCalled();
    expect(prisma.journalEntry.delete).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(jsonResponse, { status: 401 });
    expect(response).toEqual(jsonResponse);
  });
});
