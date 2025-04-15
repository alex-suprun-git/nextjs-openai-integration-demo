import { contentGQLQuery } from './fetch';

export const getContentFromCMS = async (
  query: string,
  locale: string,
  extraVariables: Record<string, any> = {},
) => {
  const variables = { locale, ...extraVariables };

  try {
    const data = await contentGQLQuery({ query, variables });

    if (!data) {
      throw new Error('Error fetching hero content');
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
