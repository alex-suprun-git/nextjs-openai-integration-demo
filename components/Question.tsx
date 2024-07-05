'use client';

import { HiMiniChevronDoubleRight } from 'react-icons/hi2';
import { FormEvent, useState } from 'react';
import { askQuestion } from '@/utils/api';

const Question = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data } = await askQuestion(question);

    setAnswer(data);
    setLoading(false);
    setQuestion('');
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
            className="mr-2 w-[33%] rounded-md border border-gray-300 p-2 outline-none"
            disabled={loading}
            minLength={10}
            maxLength={100}
            placeholder="e.g. how good was my week in average?"
          />
          {question && (
            <button
              disabled={loading}
              type="submit"
              className="btn border-gray-300 px-4 py-2 text-xl disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-black"
            >
              <HiMiniChevronDoubleRight />
            </button>
          )}
        </div>
      </form>
      {loading && <div className="loading relative top-5"></div>}
      {!loading && answer && <p className="my-4 text-xl md:max-w-[50%]">{answer}</p>}
    </div>
  );
};

export default Question;
