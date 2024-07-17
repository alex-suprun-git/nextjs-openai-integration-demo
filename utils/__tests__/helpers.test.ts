import { getExcerpt, formatDate, convertHexToRGBA, getMoodImage } from '@/utils/helpers';

describe('getExcerpt', () => {
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

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('1 Jan 2023, 01:00');
  });

  it('handles invalid date', () => {
    const formattedDate = formatDate(new Date('invalid-date'));
    expect(formattedDate).toBe('Invalid Date');
  });

  it('formats date correctly in different locale', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe('1 Jan 2023, 01:00');
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

describe('getMoodImage', () => {
  let analysis: AnalysisData = {
    mood: 'happy',
    summary: 'some summary',
    negative: false,
    subject: 'some subject',
    color: 'green',
    sentimentScore: 8,
  };

  it('should return the correct image URL for positive mood', () => {
    const result = getMoodImage(analysis);
    expect(result).toBe("url('/analysis/positive.jpg')");
  });

  it('should return the correct image URL for negative mood', () => {
    analysis = { ...analysis, mood: 'sad', negative: true };
    const result = getMoodImage(analysis);
    expect(result).toBe("url('/analysis/negative.jpg')");
  });

  it('should return the correct image URL for neutral mood', () => {
    analysis = { ...analysis, mood: 'neutral', negative: false };
    const result = getMoodImage(analysis);
    expect(result).toBe("url('/analysis/neutral.jpg')");
  });

  it('should return the correct image URL for uncertain mood', () => {
    const uncertainMoods = ['unknown', 'uncertain', 'confused', 'unclear'];
    uncertainMoods.forEach((mood) => {
      analysis = { ...analysis, mood, negative: false };
      const result = getMoodImage(analysis);
      expect(result).toBe("url('/analysis/unknown.jpg')");
    });
  });

  it('should return the correct image URL for unknown mood', () => {
    analysis = { ...analysis, mood: 'something_else', negative: false };
    const result = getMoodImage(analysis);
    expect(result).toBe("url('/analysis/positive.jpg')");
  });
});
