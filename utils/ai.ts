import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import z from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe('is the journal entry negative? (i.e. does it contain negative emotions?).'),
    summary: z.string().describe('quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.',
      ),
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.',
      ),
  }),
);

export const analyze = async (prompt: any) => {
  const model = new ChatOpenAI({
    temperature: 0,
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  });
  const result = await model.invoke(prompt);
  console.log(result);
};
