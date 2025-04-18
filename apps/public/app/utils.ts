export const getPageURL = (url: string) => {
  const [, , ...restSegments] = url.split('/');
  return restSegments.join('/');
};
