import { usePrompt } from '../PromptContext';

const TestComponent = () => {
  const { symbolsLimit, symbolsUsed } = usePrompt();
  return (
    <div>
      <span data-testid="limit">{symbolsLimit}</span>
      <span data-testid="used">{symbolsUsed}</span>
    </div>
  );
};

export default TestComponent;
