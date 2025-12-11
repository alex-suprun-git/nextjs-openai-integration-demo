import { describe, it, expect, vi } from 'vitest';
import { analyzeEntry, analysisFeedback } from '@/utils/ai';

// Mock next-intl
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn().mockResolvedValue('en'),
}));

// Mock Vercel AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn().mockResolvedValue({
    object: {
      mood: 'happy',
      subject: 'test subject',
      negative: false,
      summary: 'test summary',
      color: '#0101fe',
      sentimentScore: 8,
      title: 'Test Entry',
    },
  }),
}));

// Mock OpenAI provider
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => 'mocked-model'),
}));

// Mock LangChain components (for analysisFeedback)
vi.mock('@langchain/openai', () => ({
  ChatOpenAI: vi.fn(() => ({
    invoke: vi.fn().mockResolvedValue({ content: 'mocked output content' }),
  })),
  OpenAIEmbeddings: vi.fn(() => ({})),
}));

vi.mock('langchain/vectorstores/memory', () => ({
  MemoryVectorStore: {
    fromDocuments: vi.fn().mockResolvedValue({
      similaritySearch: vi
        .fn()
        .mockResolvedValue([
          { pageContent: 'Mocked content 1' },
          { pageContent: 'Mocked content 2' },
        ]),
    }),
  },
}));

vi.mock('langchain/chains', () => ({
  loadQARefineChain: vi.fn().mockReturnValue({
    invoke: vi.fn().mockResolvedValue({ output_text: 'refined output' }),
  }),
}));

describe('analyzeEntry', () => {
  it('returns structured analysis for given content', async () => {
    const result = await analyzeEntry('test content');
    expect(result).toEqual({
      mood: 'happy',
      subject: 'test subject',
      negative: false,
      summary: 'test summary',
      color: '#0101fe',
      sentimentScore: 8,
      title: 'Test Entry',
    });
  });

  it('handles empty content gracefully', async () => {
    const result = await analyzeEntry('');
    expect(result).toEqual({
      mood: 'happy',
      subject: 'test subject',
      negative: false,
      summary: 'test summary',
      color: '#0101fe',
      sentimentScore: 8,
      title: 'Test Entry',
    });
  });
});

describe('analysisFeedback', () => {
  it('returns expected output for a question and single entry', async () => {
    const result = await analysisFeedback('en', 'test question', [
      { content: 'test content', id: '1', createdAt: new Date('2023-01-01') },
    ]);
    expect(result).toBe('refined output');
  });

  it('returns expected output for a question and multiple entries', async () => {
    const result = await analysisFeedback('en', 'test question', [
      { content: 'test content 1', id: '1', createdAt: new Date('2023-01-01') },
      { content: 'test content 2', id: '2', createdAt: new Date('2023-01-02') },
    ]);
    expect(result).toBe('refined output');
  });

  it('handles empty question gracefully in analysisFeedback', async () => {
    const result = await analysisFeedback('en', '', [
      { content: 'test content', id: '1', createdAt: new Date('2023-01-01') },
    ]);
    expect(result).toBe('refined output');
  });

  it('handles empty entries array in analysisFeedback', async () => {
    const result = await analysisFeedback('en', 'test question', []);
    expect(result).toBeUndefined();
  });
});
