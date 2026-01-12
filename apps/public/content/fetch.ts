export const contentGQLQuery = async <T>({
  query,
  variables = {},
  tags = [],
  preview = false,
  revalidate,
}: {
  query: string;
  variables?: any;
  tags?: string[];
  preview?: boolean;
  revalidate?: number;
}): Promise<T | undefined> => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const token = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !token) {
    console.error('Contentful env vars missing', {
      hasSpaceId: Boolean(spaceId),
      hasToken: Boolean(token),
      preview,
    });
    return undefined;
  }

  const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { tags, revalidate },
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    console.error('Contentful GraphQL request failed', {
      status: res.status,
      statusText: res.statusText,
      body: bodyText.slice(0, 2000),
    });
    return undefined;
  }

  const json = (await res.json().catch((error) => {
    console.error('Failed to parse Contentful response as JSON', error);
    return null;
  })) as { data?: unknown; errors?: unknown } | null;

  if (!json) return undefined;

  const { data, errors } = json;
  if (errors) {
    console.error(errors);
  }

  return data as T;
};
