import { describe, it, expect } from 'vitest';
import { getExcerpt, formatDate } from '@/utils/helpers';

describe('getExcerpt Function', () => {
  it('should return the full content if it is less than 100 characters', () => {
    const content = 'This is a short content.';
    expect(getExcerpt(content)).toBe(content);
  });

  it('should return an excerpt with "..." if the content is 100 characters or more', () => {
    const content = `${'a'.repeat(100)} extra text`;
    expect(getExcerpt(content)).toBe(`${'a'.repeat(100)}...`);
  });

  it('should handle empty string content correctly', () => {
    const content = '';
    expect(getExcerpt(content)).toBe(content);
  });
});

describe('formatDate Function', () => {
  it('should format the date correctly in en-GB format', () => {
    const date = new Date('2024-07-12T12:00:00Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toMatch(/\d{1,2} \w{3} \d{4}, \d{1,2}:\d{2}/);
  });

  it('should handle different dates correctly', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toMatch(/\d{1,2} \w{3} \d{4}, \d{1,2}:\d{2}/);
  });
});
