import { describe, it, expect, vi, Mock } from 'vitest';
import {
  createUrl,
  updateUserPromptUsage,
  createNewEntry,
  updateEntry,
  deleteEntry,
  askQuestion,
} from '@/utils/api';
import { URL } from 'url';

Object.defineProperty(window, 'location', {
  value: { origin: 'http://localhost' },
});

vi.stubGlobal(
  'Request',
  class {
    url: string;
    method?: string;
    headers?: any;
    body?: any;
    constructor(input: string, init?: any) {
      this.url = new URL(input, window.location.origin).toString();
      if (init) {
        this.method = init.method;
        this.headers = init.headers;
        this.body = init.body;
      }
    }
  },
);

global.fetch = vi.fn();

describe('createUrl', () => {
  it('constructs the correct URL', () => {
    const origin = 'http://localhost:3000';
    Object.defineProperty(window, 'location', {
      value: { origin },
      writable: true,
    });

    const path = '/api/test';
    const url = createUrl(path);
    expect(url).toBe(`${origin}${path}`);
  });
});

describe('updateUserPromptUsage', () => {
  it('updates user and returns data', async () => {
    const mockData = { data: { id: 1, promptSymbolsUsed: 100 } };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await updateUserPromptUsage(100);
    expect(result).toEqual(mockData.data);
  });

  it('handles failed fetch', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    const result = await updateUserPromptUsage(100);
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Bad Request');
  });
});

describe('createNewEntry', () => {
  it('creates a new memo and returns data', async () => {
    const mockData = { data: { id: '1', content: 'test content' } };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await createNewEntry('test content');
    expect(result).toEqual(mockData.data);
  });

  it('handles failed fetch', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    });

    const result = await createNewEntry('test content');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Unauthorized');
  });
});

describe('updateEntry', () => {
  it('updates an entry and returns data', async () => {
    const mockData = { data: { id: '1', content: 'updated content' } };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await updateEntry('1', 'updated content');
    expect(result).toEqual(mockData.data);
  });

  it('handles failed fetch', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    const result = await updateEntry('1', 'updated content');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Not Found');
  });
});

describe('deleteEntry', () => {
  it('deletes an entry successfully', async () => {
    (fetch as Mock).mockResolvedValueOnce({ ok: true });

    const result = await deleteEntry('1');
    expect(result).toBeUndefined();
  });

  it('handles failed fetch', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Forbidden',
    });

    const result = await deleteEntry('1');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Forbidden');
  });
});

describe('askQuestion', () => {
  it('asks a question and returns data', async () => {
    const mockData = { answer: 'mocked answer' };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await askQuestion('test question');
    expect(result).toEqual(mockData);
  });

  it('handles failed fetch', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Service Unavailable',
    });

    const result = await askQuestion('test question');
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe('Service Unavailable');
  });
});
