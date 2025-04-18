export const createUrl = (path: string) => window.location.origin + path;

export const getPageURL = (url: string) => {
  const [, , ...restSegments] = url.split('/');
  return restSegments.join('/');
};

export async function fetcher(_url: string) {
  const url = createUrl(_url);

  const res = await fetch(
    new Request(url, {
      method: 'GET',
    }),
  );

  if (!res.ok) return;
  return res.json() as Promise<{ isSignedIn: boolean }>;
}
