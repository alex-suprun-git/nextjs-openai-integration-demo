import { createClient, PlainClientAPI } from 'contentful-management';

// Contentful client singleton
let contentfulClient: any = null; // Changed to any to bypass TypeScript issues

export function getContentfulClient(accessToken: string) {
  if (!contentfulClient) {
    contentfulClient = createClient({
      accessToken,
    });
  }
  return contentfulClient;
}

export async function getEnvironment(spaceId: string, environmentId: string, accessToken: string) {
  const client = getContentfulClient(accessToken);
  const space = await client.getSpace(spaceId);
  return await space.getEnvironment(environmentId);
}

export async function getContentTypes(spaceId: string, environmentId: string, accessToken: string) {
  const environment = await getEnvironment(spaceId, environmentId, accessToken);
  const contentTypes = await environment.getContentTypes();
  return contentTypes.items;
}

export async function getEntries(
  spaceId: string,
  environmentId: string,
  accessToken: string,
  contentTypeId?: string,
  limit: number = 100,
) {
  const environment = await getEnvironment(spaceId, environmentId, accessToken);

  let query: any = { limit };
  if (contentTypeId) {
    query['content_type'] = contentTypeId;
  }

  const entries = await environment.getEntries(query);
  return entries.items;
}

export async function createEntry(
  spaceId: string,
  environmentId: string,
  accessToken: string,
  contentTypeId: string,
  fields: Record<string, any>,
) {
  const environment = await getEnvironment(spaceId, environmentId, accessToken);
  const contentType = await environment.getContentType(contentTypeId);

  const entry = await environment.createEntry(contentTypeId, {
    fields: formatFieldsForContentful(fields),
  });

  await entry.publish();
  return entry;
}

export async function updateEntry(
  spaceId: string,
  environmentId: string,
  accessToken: string,
  entryId: string,
  fields: Record<string, any>,
) {
  const environment = await getEnvironment(spaceId, environmentId, accessToken);
  const entry = await environment.getEntry(entryId);

  // Update fields
  entry.fields = {
    ...entry.fields,
    ...fields,
  };

  const updatedEntry = await entry.update();
  await updatedEntry.publish();
  return updatedEntry;
}

export async function deleteEntry(
  spaceId: string,
  environmentId: string,
  accessToken: string,
  entryId: string,
) {
  const environment = await getEnvironment(spaceId, environmentId, accessToken);
  const entry = await environment.getEntry(entryId);
  await entry.unpublish();
  await entry.delete();
  return true;
}

// Helper function to format fields for Contentful
export function formatFieldsForContentful(fields: Record<string, any>): Record<string, any> {
  const formattedFields: Record<string, any> = {};

  Object.keys(fields).forEach((fieldName) => {
    const fieldValue = fields[fieldName];

    if (typeof fieldValue === 'string') {
      // For simple string fields, create both locales
      formattedFields[fieldName] = {
        en: fieldValue,
        de: fieldValue,
      };
    } else if (typeof fieldValue === 'object' && fieldValue !== null) {
      // For complex fields (like Rich Text), use as is
      formattedFields[fieldName] = fieldValue;
    }
  });

  return formattedFields;
}

// Helper function to extract values from Contentful fields
export function extractValuesFromContentful(fields: Record<string, any>): Record<string, any> {
  const extractedFields: Record<string, any> = {};

  Object.keys(fields).forEach((fieldName) => {
    const fieldValue = fields[fieldName];

    if (fieldValue && typeof fieldValue === 'object') {
      // If it has locale keys, extract the first available locale
      if (fieldValue.en !== undefined) {
        extractedFields[fieldName] = fieldValue.en;
      } else if (fieldValue.de !== undefined) {
        extractedFields[fieldName] = fieldValue.de;
      } else {
        extractedFields[fieldName] = fieldValue;
      }
    } else {
      extractedFields[fieldName] = fieldValue;
    }
  });

  return extractedFields;
}
