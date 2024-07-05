export const getExcerpt = (content: string): string =>
  content.length >= 75 ? `${content.slice(0, 75)}...` : content;

export const formatDate = (date: Date): string => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: userTimezone,
  }).format(date);
};
