import { describe, it, expect, vi, Mock } from 'vitest';
import {
  createUrl,
  updateUser,
  createNewEntry,
  updateEntry,
  deleteEntry,
  askQuestion,
} from '@/utils/api';

// Mock the fetch function globally to intercept all fetch calls
global.fetch = vi.fn();

describe('createUrl', () => {
  it('constructs the correct URL', () => {
    // Mock the window object and its location property
    global.window = Object.create(window);
    const origin = 'http://localhost:3000';
    Object.defineProperty(window, 'location', {
      value: {
        origin,
      },
      writable: true,
    });

    const path = '/api/test';
    const url = createUrl(path);
    // Assert that the constructed URL is correct
    expect(url).toBe(`${origin}${path}`);
  });
});

describe('updateUser', () => {
  it('updates user and returns data', async () => {
    const mockData = { data: { id: 1, promptSymbolsUsed: 100 } };
    // Mock the fetch function to return a successful response
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await updateUser(100);
    // Assert that the returned data matches the mock data
    expect(result).toEqual(mockData.data);
  });

  it('handles failed fetch', async () => {
    // Mock the fetch function to return a failed response
    (fetch as Mock).mockResolvedValueOnce({ ok: false });
    const result = await updateUser(100);
    // Assert that the function returns undefined on failure
    expect(result).toBeUndefined();
  });
});

describe('createNewEntry', () => {
  it('creates a new entry and returns data', async () => {
    const mockData = { data: { id: '1', content: 'test content' } };
    // Mock the fetch function to return a successful response
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await createNewEntry('test content');
    // Assert that the returned data matches the mock data
    expect(result).toEqual(mockData.data);
  });

  it('handles failed fetch', async () => {
    // Mock the fetch function to return a failed response
    (fetch as Mock).mockResolvedValueOnce({ ok: false });
    const result = await createNewEntry('test content');
    // Assert that the function returns undefined on failure
    expect(result).toBeUndefined();
  });
});

describe('updateEntry', () => {
  it('updates an entry and returns data', async () => {
    const mockData = { data: { id: '1', content: 'updated content' } };
    // Mock the fetch function to return a successful response
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await updateEntry('1', 'updated content');
    // Assert that the returned data matches the mock data
    expect(result).toEqual(mockData.data);
  });

  it('handles failed fetch', async () => {
    // Mock the fetch function to return a failed response
    (fetch as Mock).mockResolvedValueOnce({ ok: false });
    const result = await updateEntry('1', 'updated content');
    // Assert that the function returns undefined on failure
    expect(result).toBeUndefined();
  });
});

describe('deleteEntry', () => {
  it('deletes an entry successfully', async () => {
    // Mock the fetch function to return a successful response
    (fetch as Mock).mockResolvedValueOnce({ ok: true });

    const result = await deleteEntry('1');
    // Assert that the function returns undefined on success
    expect(result).toBeUndefined();
  });

  it('handles failed fetch', async () => {
    // Mock the fetch function to return a failed response
    (fetch as Mock).mockResolvedValueOnce({ ok: false });

    const result = await deleteEntry('1');
    // Assert that the function returns undefined on failure
    expect(result).toBeUndefined();
  });
});

describe('askQuestion', () => {
  it('asks a question and returns data', async () => {
    const mockData = { answer: 'mocked answer' };
    // Mock the fetch function to return a successful response
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await askQuestion('test question');
    // Assert that the returned data matches the mock data
    expect(result).toEqual(mockData);
  });

  it('handles failed fetch', async () => {
    // Mock the fetch function to return a failed response
    (fetch as Mock).mockResolvedValueOnce({ ok: false });

    const result = await askQuestion('test question');
    // Assert that the function returns undefined on failure
    expect(result).toBeUndefined();
  });
});
