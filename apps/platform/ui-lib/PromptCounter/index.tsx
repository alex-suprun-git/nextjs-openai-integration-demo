'use client';

import { usePrompt } from '@/contexts/PromptContext';
import { useTranslations } from 'next-intl';
import { FaQuestionCircle } from 'react-icons/fa';

function PromptCounter() {
  const t = useTranslations('Header');

  const { symbolsLeft, symbolsLimit, limitRenewalDate } = usePrompt();

  return (
    <div data-testid="promptCounter" className="flex items-center">
      <p className="leading-6">
        {t.rich('labels.promptSymbolsRemaining', {
          symbolsLeft,
          symbolsLimit,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <span
        className="tooltip tooltip-left ml-2"
        data-tip={t('labels.promptSymbolsRenewalDate', { limitRenewalDate })}
      >
        <span className="cursor-pointer">
          <FaQuestionCircle />
        </span>
      </span>
    </div>
  );
}

export default PromptCounter;
