import { franc } from 'franc-min';

export const getExcerpt = (content: string): string =>
  content.length >= 100 ? `${content.slice(0, 100)}...` : content;

export const formatDate = (date: Date): string => {
  if (typeof window === 'undefined') {
    return date.toDateString();
  }

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: userTimezone,
  }).format(date);
};

export const convertHexToRGBA = (_hex: string, _opacity: number = 1): string => {
  let opacity = _opacity;
  let hex = _hex.replace('#', '');

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  } else if (opacity > 100) opacity = 1;

  return `rgba(${r},${g},${b},${opacity})`;
};

export const getMoodImage = (analysis: AnalysisData): string => {
  const uncertainMood = ['unknown', 'uncertain', 'confused', 'unclear'];

  const condition = uncertainMood.includes(analysis.mood)
    ? 'unknown'
    : analysis.negative
      ? 'negative'
      : analysis.mood === 'neutral'
        ? 'neutral'
        : 'positive';

  const analysisImage = {
    positive: "url('/analysis/positive.jpg')",
    negative: "url('/analysis/negative.jpg')",
    neutral: "url('/analysis/neutral.jpg')",
    unknown: "url('/analysis/unknown.jpg')",
  }[condition];

  return analysisImage;
};

export const detectLanguage = (text: string): string => {
  const langCode = franc(text);
  switch (langCode) {
    case 'eng':
      return 'English';
    case 'deu':
      return 'Deutsch';
    case 'rus':
      return 'Russian';
    default:
      return 'English';
  }
};
