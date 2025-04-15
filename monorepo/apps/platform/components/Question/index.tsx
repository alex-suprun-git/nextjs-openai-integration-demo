'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HiMiniChevronDoubleRight } from 'react-icons/hi2';
import { askQuestion, updateUserPromptUsage } from '@/utils/api';
import { usePrompt } from '@/contexts/PromptContext';
import { Loading } from '@/ui-lib';

const Question = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const { symbolsUsed, symbolsLimit } = usePrompt();
  const isPromptSymbolsExceeded = +symbolsUsed >= +symbolsLimit;

  const t = useTranslations('analysisRequest');

  if (isPromptSymbolsExceeded) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await askQuestion(question);
      setAnswer(data);
      await updateUserPromptUsage(question.length);
      setQuestion('');
    } catch (error) {
      setAnswer(t('labels.responseError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-12">
      <form data-testid="promptInput-wrapper" onSubmit={handleSubmit}>
        <span className="mb-4 block font-semibold text-stone-300">{t('headline')}</span>
        <div className="flex">
          <input
            id="analysis-request"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mr-2 w-[100%] rounded-md border border-gray-300 bg-slate-700 p-2 text-stone-300 outline-none md:w-[50%] lg:w-[33%]"
            disabled={isLoading}
            minLength={15}
            maxLength={100}
            placeholder={t('labels.inputPlaceholder')}
          />
          {question && (
            <button
              disabled={isLoading}
              type="submit"
              className="btn border-0 border-gray-300 px-4 py-2 text-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-black"
            >
              <HiMiniChevronDoubleRight />
            </button>
          )}
        </div>
      </form>
      {isLoading && <Loading fullscreen />}
      {!isLoading && answer && (
        <p data-testid="promptInput-answer" className="text my-4 md:max-w-[50%]">
          {answer}
        </p>
      )}
    </div>
  );
};

export default Question;
