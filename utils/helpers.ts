export const getExcerpt = (content: string): string =>
  content.length >= 100 ? `${content.slice(0, 100)}...` : content;

export const formatDate = (date: Date, locale?: UserLocale): string => {
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const supportedLocales = {
    en: 'en-GB',
    de: 'de-DE',
  };

  return new Intl.DateTimeFormat((locale && supportedLocales[locale]) || 'en-GB', {
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
    positive: "url('/assets/analysis/positive.jpg')",
    negative: "url('/assets/analysis/negative.jpg')",
    neutral: "url('/assets/analysis/neutral.jpg')",
    unknown: "url('/assets/analysis/unknown.jpg')",
  }[condition];

  return analysisImage;
};

export const formatPromptData = (data: any, locale: string) => {
  const formattedSymbolsLeft = new Intl.NumberFormat().format(
    data.promptSymbolsLimit - data.promptSymbolsUsed,
  );
  const formattedSymbolsLimit = new Intl.NumberFormat().format(data.promptSymbolsLimit);
  const userPromptLimitRenewal = formatDate(data.promptSymbolsLimitRenewal, locale as UserLocale);

  return {
    symbolsUsed: formattedSymbolsLeft,
    symbolsLimit: formattedSymbolsLimit,
    limitRenewalDate: userPromptLimitRenewal,
  };
};
