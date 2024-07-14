export const getExcerpt = (content: string): string =>
  content.length >= 100 ? `${content.slice(0, 100)}...` : content;

export const formatDate = (date: Date): string => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: userTimezone,
  }).format(date);
};

export const convertHexToRGBA = (_hex: string, _opacity: number = 1) => {
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
