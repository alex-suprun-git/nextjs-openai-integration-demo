import { usePrompt } from '../PromptContext';

const TestComponent: React.FC = () => {
  const { promptSymbolsLimit, promptSymbolsUsed } = usePrompt();
  return (
    <div>
      <span data-testid="limit">{promptSymbolsLimit}</span>
      <span data-testid="used">{promptSymbolsUsed}</span>
    </div>
  );
};

export default TestComponent;
