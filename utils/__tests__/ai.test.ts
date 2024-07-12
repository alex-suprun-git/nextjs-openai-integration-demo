import { describe, it, expect, vi } from 'vitest';
import { analyzeEntry, qa } from '@/utils/ai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

// Mock adjustment for OpenAI to include _modelType and other methods
vi.mock('@langchain/openai', () => ({
  // Mock for ChatOpenAI
  ChatOpenAI: vi.fn(() => ({
    invoke: vi.fn().mockResolvedValue({ content: 'mocked output content' }),
  })),
  // Mock for OpenAI
  OpenAI: vi.fn(() => ({
    invoke: vi.fn().mockResolvedValue({ content: 'mocked output content' }),
  })),
  // Mock for OpenAIEmbeddings
  OpenAIEmbeddings: vi.fn(() => ({})),
}));

// Ensure PromptTemplate and its dependencies are correctly mocked
vi.mock('@langchain/core/prompts', () => ({
  PromptTemplate: vi.fn(() => ({
    format: vi.fn().mockResolvedValue('formatted prompt'),
  })),
}));

vi.mock('langchain/output_parsers', () => ({
  StructuredOutputParser: {
    fromZodSchema: vi.fn().mockReturnValue({
      getFormatInstructions: vi.fn().mockReturnValue('format instructions'),
      parse: vi.fn().mockResolvedValue('parsed output'),
    }),
  },
  OutputFixingParser: {
    fromLLM: vi.fn().mockReturnValue({
      parse: vi.fn().mockResolvedValue('fixed output'),
    }),
  },
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
  it('returns parsed output for given content', async () => {
    const result = await analyzeEntry('test content');
    expect(result).toBe('parsed output');
  });

  it('returns fixed output when initial parsing fails', async () => {
    // Adjust the mock to simulate parsing failure
    const originalParse = vi.mocked(StructuredOutputParser.fromZodSchema({} as z.ZodTypeAny).parse);
    originalParse.mockRejectedValueOnce(new Error('Parsing Error'));

    const result = await analyzeEntry('test content with parsing error');
    expect(result).toBe('fixed output');
  });
});

describe('qa', () => {
  it('returns expected output for a question and single entry', async () => {
    const result = await qa('test question', [
      { content: 'test content', id: '1', createdAt: new Date('2023-01-01') },
    ]);
    expect(result).toBe('refined output');
  });

  it('returns expected output for a question and multiple entries', async () => {
    const result = await qa('test question', [
      { content: 'test content 1', id: '1', createdAt: new Date('2023-01-01') },
      { content: 'test content 2', id: '2', createdAt: new Date('2023-01-02') },
    ]);
    expect(result).toBe('refined output');
  });

  it('handles empty content gracefully in analyzeEntry', async () => {
    const result = await analyzeEntry('');
    expect(result).toBe('parsed output');
  });

  it('handles empty question gracefully in qa', async () => {
    const result = await qa('', [
      { content: 'test content', id: '1', createdAt: new Date('2023-01-01') },
    ]);
    expect(result).toBe('refined output');
  });

  it('handles empty entries array in qa', async () => {
    const result = await qa('test question', []);
    expect(result).toBeUndefined();
  });
});
