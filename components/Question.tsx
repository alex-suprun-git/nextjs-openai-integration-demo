'use client';

import { HiMiniChevronDoubleRight } from 'react-icons/hi2';
import { FormEvent, useState } from 'react';
import { askQuestion, updateUser } from '@/utils/api';
import { usePrompt } from '@/contexts/PromptContext';
import { useRouter } from 'next/navigation';

const Question = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const { promptSymbolsUsed, promptSymbolsLimit } = usePrompt();
  const isPromptSymbolsExceeded = promptSymbolsUsed >= promptSymbolsLimit;

  if (isPromptSymbolsExceeded) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data } = await askQuestion(question);

    setAnswer(data);
    setLoading(false);
    await updateUser(promptSymbolsUsed + question.length);
    setQuestion('');
    router.refresh();
  };

  return (
    <div className="my-12">
      <form onSubmit={handleSubmit}>
        <span className="mb-4 block font-semibold text-white">
          Request an AI analysis of your notes (10 to 100 characters)
        </span>
        <div className="flex">
          <input
            id="analysis-request"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="mr-2 w-[100%] rounded-md border border-gray-300 bg-slate-700 p-2 outline-none md:w-[50%] lg:w-[33%]"
            disabled={isLoading}
            minLength={10}
            maxLength={100}
            placeholder="e.g. how good was my week in average?"
          />
          {question && (
            <button
              disabled={isLoading}
              type="submit"
              className="btn border-gray-300 px-4 py-2 text-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-black"
            >
              <HiMiniChevronDoubleRight />
            </button>
          )}
        </div>
      </form>
      {isLoading && <div className="loading relative top-5"></div>}
      {!isLoading && answer && <p className="text my-4 md:max-w-[50%]">{answer}</p>}
    </div>
  );
};

export default Question;
