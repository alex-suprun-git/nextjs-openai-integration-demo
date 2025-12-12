import { ChatOpenAI } from '@langchain/openai';
import { updateEntry, getEntries } from './contentful';

export interface SimpleAboutMeUpdateConfig {
  spaceId: string;
  environmentId: string;
  accessToken: string;
  entryId: string;
  language: 'en' | 'de';
  updateStyle?: 'refactor' | 'rewrite' | 'enhance' | 'translate';
  additionalPrompt?: string;
}

export interface SimpleAboutMeUpdateResult {
  success: boolean;
  entryId?: string;
  error?: string;
  oldContent?: string;
  newContent?: string;
}

// Function to extract plain text from Rich Text structure
function extractTextFromRichText(richText: any): string {
  if (!richText || !richText.content || !Array.isArray(richText.content)) {
    return '';
  }

  let text = '';
  richText.content.forEach((paragraph: any) => {
    if (paragraph.content && Array.isArray(paragraph.content)) {
      paragraph.content.forEach((textNode: any) => {
        if (textNode.nodeType === 'text' && textNode.value) {
          text += textNode.value;
        }
      });
    }
  });

  return text;
}

// Function to create Rich Text structure from markdown text
function createRichTextFromText(text: string): any {
  // Split by double newlines to get paragraphs
  const paragraphs = text.split('\n\n').filter((p) => p.trim());

  const content: any[] = [];

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    const paragraphContent = parseMarkdownInText(trimmedParagraph);
    content.push({
      data: {},
      content: paragraphContent,
      nodeType: 'paragraph',
    });
  }

  // If no paragraphs were created, create a single paragraph
  if (content.length === 0) {
    const paragraphContent = parseMarkdownInText(text);
    content.push({
      data: {},
      content: paragraphContent,
      nodeType: 'paragraph',
    });
  }

  return {
    data: {},
    content: content,
    nodeType: 'document',
  };
}

// Function to parse markdown formatting in text
function parseMarkdownInText(text: string): any[] {
  const content: any[] = [];
  let currentText = '';
  let i = 0;

  while (i < text.length) {
    if (text.slice(i, i + 2) === '**') {
      // Bold text
      if (currentText) {
        content.push({
          data: {},
          marks: [],
          value: currentText,
          nodeType: 'text',
        });
        currentText = '';
      }

      i += 2;
      let boldText = '';
      while (i < text.length && text.slice(i, i + 2) !== '**') {
        boldText += text[i];
        i++;
      }

      if (i < text.length) {
        content.push({
          data: {},
          marks: [{ type: 'bold' }],
          value: boldText,
          nodeType: 'text',
        });
        i += 2;
      }
    } else {
      currentText += text[i];
      i++;
    }
  }

  if (currentText) {
    content.push({
      data: {},
      marks: [],
      value: currentText,
      nodeType: 'text',
    });
  }

  return content;
}

// Function to generate updated content using AI
async function generateUpdatedContent(
  currentContent: string,
  language: 'en' | 'de',
  updateStyle: 'refactor' | 'rewrite' | 'enhance' | 'translate' = 'refactor',
  additionalPrompt?: string,
): Promise<string> {
  const model = new ChatOpenAI({
    modelName: 'gpt-5-mini',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const languageName = language === 'en' ? 'English' : 'German';

  let styleInstruction = '';
  switch (updateStyle) {
    case 'refactor':
      styleInstruction =
        'Refactor and improve the existing content while maintaining the same meaning and structure.';
      break;
    case 'rewrite':
      styleInstruction =
        'Completely rewrite the content with a fresh perspective while keeping the core message.';
      break;
    case 'enhance':
      styleInstruction = 'Enhance and expand the content with additional details and improvements.';
      break;
    case 'translate':
      styleInstruction =
        'Translate the content to the specified language while maintaining the same meaning, tone, and structure.';
      break;
  }

  const systemPrompt = `You are a professional content writer specializing in ${languageName} content. ${styleInstruction} 
  
  CRITICAL FORMATTING REQUIREMENTS:
  - Structure content in logical paragraphs with proper breaks
  - Use **bold** for important terms, technologies, key phrases, and section headers
  - Each paragraph should be a logical unit of content
  - Maintain professional tone and engaging style
  - Write in ${languageName} language
  - Preserve the original meaning and key information
  ${additionalPrompt ? `- Additional requirements: ${additionalPrompt}` : ''}
  
  FORMATTING GUIDELINES:
  - Use **bold** for: technology names (React, Next.js, TypeScript), role titles, key achievements, section headers
  - Separate different topics into distinct paragraphs
  - Use numbered lists for achievements (1. Achievement one, 2. Achievement two)
  - Use bullet points for technical skills when appropriate
  
  EXACT OUTPUT FORMAT:
  You must structure your response with exactly this format:
  
  **First Paragraph Title**
  
  First paragraph content with **bold** terms.
  
  **Second Paragraph Title** (if applicable)
  
  Second paragraph content with **bold** terms.
  
  **Third Paragraph Title** (if applicable)
  
  Third paragraph content with **bold** terms.
  
  IMPORTANT: Each paragraph must be separated by exactly two line breaks (\\n\\n). Do not include any other formatting or structure. Return only the content in this exact format.`;

  const response = await model.invoke([
    ['system', systemPrompt],
    ['human', `Current content: ${currentContent || 'No content available'}`],
  ]);

  return response.content as string;
}

// Main function to update About me content
export async function updateSimpleAboutMeContent(
  config: SimpleAboutMeUpdateConfig,
): Promise<SimpleAboutMeUpdateResult> {
  try {
    const {
      spaceId,
      environmentId,
      accessToken,
      entryId,
      language,
      updateStyle = 'refactor',
      additionalPrompt,
    } = config;

    // Get current entry
    const entries = await getEntries(spaceId, environmentId, accessToken, 'page', 10);
    const currentEntry = entries.find((entry: any) => entry.sys.id === entryId);

    if (!currentEntry) {
      return { success: false, error: 'About me entry not found' };
    }

    // Extract current content for the specified language
    const currentContent = currentEntry.fields.content?.[language];
    const currentText = extractTextFromRichText(currentContent);

    // Generate updated content
    const updatedText = await generateUpdatedContent(
      currentText,
      language,
      updateStyle,
      additionalPrompt,
    );

    // Create Rich Text structure
    const updatedRichText = createRichTextFromText(updatedText);

    // Update the entry - preserve existing fields and only update the specified language
    const updatedEntry = await updateEntry(spaceId, environmentId, accessToken, entryId, {
      content: {
        ...currentEntry.fields.content, // This spreads existing locales
        [language]: updatedRichText, // This overwrites the target language
      },
    });

    return {
      success: true,
      entryId: updatedEntry.sys.id,
      oldContent: currentText,
      newContent: updatedText,
    };
  } catch (error) {
    console.error('Error updating About me content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Function to update both languages at once
export async function updateSimpleAboutMeBothLanguages(
  config: Omit<SimpleAboutMeUpdateConfig, 'language'>,
): Promise<{
  en: SimpleAboutMeUpdateResult;
  de: SimpleAboutMeUpdateResult;
}> {
  try {
    const {
      spaceId,
      environmentId,
      accessToken,
      entryId,
      updateStyle = 'refactor',
      additionalPrompt,
    } = config;

    // Get current entry
    const entries = await getEntries(spaceId, environmentId, accessToken, 'page', 10);
    const currentEntry = entries.find((entry: any) => entry.sys.id === entryId);

    if (!currentEntry) {
      return {
        en: { success: false, error: 'About me entry not found' },
        de: { success: false, error: 'About me entry not found' },
      };
    }

    // Extract current content for both languages
    const enContent = currentEntry.fields.content?.en;
    const deContent = currentEntry.fields.content?.de;

    let enText = '';
    let deText = '';

    // Extract plain text from Rich Text structure for English
    if (enContent?.content && Array.isArray(enContent.content)) {
      enContent.content.forEach((paragraph: any) => {
        if (paragraph.content && Array.isArray(paragraph.content)) {
          paragraph.content.forEach((textNode: any) => {
            if (textNode.nodeType === 'text' && textNode.value) {
              enText += textNode.value;
            }
          });
        }
      });
    }

    // Extract plain text from Rich Text structure for German
    if (deContent?.content && Array.isArray(deContent.content)) {
      deContent.content.forEach((paragraph: any) => {
        if (paragraph.content && Array.isArray(paragraph.content)) {
          paragraph.content.forEach((textNode: any) => {
            if (textNode.nodeType === 'text' && textNode.value) {
              deText += textNode.value;
            }
          });
        }
      });
    }

    // Generate updated content for English first
    const updatedEnText = await generateUpdatedContent(
      enText || 'Default English content',
      'en',
      updateStyle,
      additionalPrompt,
    );

    // Generate German translation based on the English content
    const updatedDeText = await generateUpdatedContent(
      updatedEnText,
      'de',
      'translate',
      'Provide a professional German translation that maintains the same meaning, tone, and structure as the English version',
    );

    // Create Rich Text structures using the proper function
    const updatedEnRichText = createRichTextFromText(updatedEnText);
    const updatedDeRichText = createRichTextFromText(updatedDeText);

    // Update the entry with both languages
    const updatedEntry = await updateEntry(spaceId, environmentId, accessToken, entryId, {
      content: {
        en: updatedEnRichText,
        de: updatedDeRichText,
      },
    });

    return {
      en: {
        success: true,
        entryId: updatedEntry.sys.id,
        oldContent: enText,
        newContent: updatedEnText,
      },
      de: {
        success: true,
        entryId: updatedEntry.sys.id,
        oldContent: deText,
        newContent: updatedDeText,
      },
    };
  } catch (error) {
    console.error('Error updating About me content in both languages:', error);
    return {
      en: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      de: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
    };
  }
}
