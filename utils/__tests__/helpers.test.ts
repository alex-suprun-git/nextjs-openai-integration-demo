import { getExcerpt, formatDate, convertHexToRGBA } from '@/utils/helpers';

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

describe('convertHexToRGBA', () => {
  it('should convert 3-digit hex code to rgba correctly', () => {
    expect(convertHexToRGBA('#abc', 0.5)).toBe('rgba(170,187,204,0.5)');
  });

  it('should convert 6-digit hex code to rgba correctly', () => {
    expect(convertHexToRGBA('#aabbcc', 0.5)).toBe('rgba(170,187,204,0.5)');
  });

  it('should handle opacity greater than 1 correctly', () => {
    expect(convertHexToRGBA('#aabbcc', 50)).toBe('rgba(170,187,204,0.5)');
  });

  it('should handle default opacity correctly', () => {
    expect(convertHexToRGBA('#aabbcc')).toBe('rgba(170,187,204,1)');
  });

  it('should handle hex code without # correctly', () => {
    expect(convertHexToRGBA('aabbcc', 0.5)).toBe('rgba(170,187,204,0.5)');
  });

  it('should handle opacity of 1 correctly', () => {
    expect(convertHexToRGBA('#aabbcc', 1)).toBe('rgba(170,187,204,1)');
  });

  it('should handle invalid opacity values correctly', () => {
    expect(convertHexToRGBA('#aabbcc', 101)).toBe('rgba(170,187,204,1)');
    expect(convertHexToRGBA('#aabbcc', -1)).toBe('rgba(170,187,204,-1)');
  });
});
