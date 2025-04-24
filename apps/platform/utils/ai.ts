import { getLocale } from 'next-intl/server';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { OutputFixingParser, StructuredOutputParser } from 'langchain/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { Document } from 'langchain/document';
import { loadQARefineChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import z from 'zod';

const modelParams = {
  model: 'o4-mini',
};

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z.string().describe('the mood of the person who wrote the journal entry.'),
    subject: z.string().describe('the subject of the journal entry.'),
    negative: z
      .boolean()
      .describe('is the journal entry negative? (i.e. does it contain negative emotions?).'),
    summary: z.string().max(100).describe('quick summary of the entire entry.'),
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
    title: z.string().describe('A concise title summarizing the journal entry.'),
  }) as any,
);

const getPrompt = async (content: string, language: UserLocale) => {
  const formatInstructions = parser.getFormatInstructions();

  const templates = {
    de: 'Analysiere den folgenden Tagebucheintrag und antworte auf Deutsch. Übersetze die Formatierungsanweisungen ins Deutsche und befolge sie unbedingt! \n{formatInstructions}\n{entry}',
    en: 'Analyze the following journal entry and respond in English. Follow the instructions and format your response to match the format instructions, no matter what! \n{formatInstructions}\n{entry}',
  };

  const prompt = new PromptTemplate({
    template: templates[language],
    inputVariables: ['entry'],
    partialVariables: { formatInstructions },
  });

  const input = await prompt.format({
    entry: content,
  });

  return input;
};

export const analyzeEntry = async (content: string) => {
  const locale = await getLocale();

  const input = await getPrompt(content, locale as UserLocale);
  const model = new ChatOpenAI({
    ...modelParams,
    apiKey: process.env.OPENAI_API_KEY,
  });
  const output = await model.invoke(input);

  try {
    return await parser.parse(output.content as string);
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(new ChatOpenAI(modelParams), parser);
    const fix = await fixParser.parse(output.content as string);
    return fix;
  }
};

export const analysisFeedback = async (
  language: UserLocale,
  question: string,
  entries: BaseEntry[],
) => {
  if (!entries.length) {
    return undefined;
  }

  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content as string,
        metadata: { source: entry.id, date: entry.createdAt },
      }),
  );
  const model = new ChatOpenAI(modelParams);
  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);

  const templates = {
    en: `Answer the following question focusing exclusively on the person's mood and feelings based on the given documents. If the question touches on any other topic or if the context is unclear, please respond with a polite request to rephrase the question. Ensure your answer is in the same language as the input. \nQuestion: {question}`,
    de: `Beantworte die folgende Frage ausschließlich im Hinblick auf die Stimmung und Gefühle der Person basierend auf den gegebenen Dokumenten. Falls die Frage ein anderes Thema betrifft oder der Kontext unklar ist, bitte höflich um eine Umformulierung der Frage. Stelle sicher, dass deine Antwort in derselben Sprache wie die Eingabe erfolgt. \nFrage: {question}`,
  };

  const promptTemplate = new PromptTemplate({
    template: templates[language],
    inputVariables: ['question'],
  });

  const input = await promptTemplate.format({
    question: question,
  });

  const res = await chain.invoke({
    input_documents: relevantDocs,
    question: input,
  });

  return res.output_text;
};
