import { ChatOpenAI } from '@langchain/openai';
import {
  getEntries,
  createEntry,
  updateEntry,
  formatFieldsForContentful,
  extractValuesFromContentful,
} from './contentful';

export interface ContentGenerationConfig {
  spaceId: string;
  environmentId: string;
  accessToken: string;
  contentTypeId: string;
  prompt: string;
  updateExisting?: boolean;
  entryId?: string;
}

export interface ContentGenerationResult {
  success: boolean;
  entryId?: string;
  error?: string;
  oldContent?: string;
  newContent?: string;
}

// Generate content using AI
export async function generateContent(prompt: string, language: string = 'en'): Promise<string> {
  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = `You are a professional content writer. Generate high-quality content in ${language} language based on the following prompt. Make it engaging, informative, and well-structured.`;

  const response = await model.invoke([
    ['system', systemPrompt],
    ['human', prompt],
  ]);

  return response.content as string;
}

// Generate content and save to Contentful
export async function generateContentForContentful(
  config: ContentGenerationConfig,
): Promise<ContentGenerationResult> {
  try {
    const {
      spaceId,
      environmentId,
      accessToken,
      contentTypeId,
      prompt,
      updateExisting = false,
      entryId,
    } = config;

    // Generate content using AI
    const generatedContent = await generateContent(prompt);

    if (updateExisting && entryId) {
      // Update existing entry
      const entries = await getEntries(spaceId, environmentId, accessToken, contentTypeId, 10);
      const existingEntry = entries.find((entry: any) => entry.sys.id === entryId);

      if (!existingEntry) {
        return { success: false, error: 'Entry not found' };
      }

      // Extract old content for comparison
      const oldContent = extractValuesFromContentful(existingEntry.fields);
      const oldContentText = oldContent.content || oldContent.title || '';

      // Update the entry
      const updatedEntry = await updateEntry(spaceId, environmentId, accessToken, entryId, {
        content: {
          en: generatedContent,
          de: generatedContent, // For now, use same content for both languages
        },
      });

      return {
        success: true,
        entryId: updatedEntry.sys.id,
        oldContent: oldContentText,
        newContent: generatedContent,
      };
    } else {
      // Create new entry
      const newEntry = await createEntry(spaceId, environmentId, accessToken, contentTypeId, {
        title: `AI Generated Content - ${new Date().toISOString()}`,
        content: generatedContent,
      });

      return {
        success: true,
        entryId: newEntry.sys.id,
        newContent: generatedContent,
      };
    }
  } catch (error) {
    console.error('Error generating content for Contentful:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Generate multiple content entries
export async function generateMultipleContentEntries(
  configs: ContentGenerationConfig[],
): Promise<ContentGenerationResult[]> {
  const results: ContentGenerationResult[] = [];

  for (const config of configs) {
    try {
      const result = await generateContentForContentful(config);
      results.push(result);
    } catch (error) {
      console.error(`Error generating content for config:`, config, error);
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  }

  return results;
}

// Update existing content with AI
export async function updateExistingContentWithAI(
  spaceId: string,
  environmentId: string,
  accessToken: string,
  entryId: string,
  contentTypeId: string,
  prompt: string,
): Promise<ContentGenerationResult> {
  return generateContentForContentful({
    spaceId,
    environmentId,
    accessToken,
    contentTypeId,
    prompt,
    updateExisting: true,
    entryId,
  });
}

// Create content generation configurations
export function createContentGenerationConfigs(
  baseConfig: Omit<ContentGenerationConfig, 'prompt'>,
  prompts: string[],
): ContentGenerationConfig[] {
  return prompts.map((prompt, index) => ({
    ...baseConfig,
    prompt: `${prompt} (Entry ${index + 1})`,
  }));
}
