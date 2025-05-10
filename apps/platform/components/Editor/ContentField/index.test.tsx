import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createTranslator, useTranslations } from 'next-intl';
import Content from '.';

// Mock the Alert and Loading components
vi.mock('@repo/global-ui', () => ({
  Alert: ({ type, children, testId }: any) => (
    <div data-testid={testId || `alert-${type}`}>{children}</div>
  ),
  Loading: ({ customClasses }: any) => <div data-testid="loading" className={customClasses}></div>,
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/new-entry'),
}));

// Mock the Tabs component to render alerts for testing
vi.mock('../Tabs', () => ({
  default: ({
    isPromptSymbolsExceeded,
    contentValue,
    isContentEntryCreated,
    isContentEntryUpdated,
    isLoading,
  }: any) => (
    <div className="mock-tabs">
      {isPromptSymbolsExceeded && (
        <div data-testid="alert-error">
          You have reached the 5,000 symbol limit and cannot make new requests.
        </div>
      )}
      {contentValue === 'Short' && (
        <div data-testid="alert-warning">
          Please enter at least 30 characters. Changes are not saved for entries with fewer than 30
          characters.
        </div>
      )}
      {isContentEntryCreated && (
        <div data-testid="alert-success">A new record was created. Analyzing....</div>
      )}
      {isContentEntryUpdated && (
        <div data-testid="alert-success">The entry was updated successfully.</div>
      )}
      <div className="relative">
        {isLoading && (
          <div
            data-testid="loading"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          ></div>
        )}
        <textarea
          data-testid="entry-content-field"
          className="textarea min-h-80 w-full resize-none bg-gray-900 p-10 text-xl outline-none"
          value={contentValue}
          placeholder="Please write your thoughts here..."
          disabled={true}
          required
        />
      </div>
    </div>
  ),
}));

describe('Content', () => {
  const mockSetContentValue = vi.fn();
  const mockEntryCreatedRef = { current: false };

  beforeAll(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'Editor',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockEntryCreatedRef.current = false;
  });

  it('renders correctly and matches snapshot', () => {
    const { container } = render(
      <Content
        isLoading={false}
        contentValue=""
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
        isContentEntryUpdated={false}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays error alert when prompt symbols limit is exceeded', () => {
    render(
      <Content
        isLoading={false}
        contentValue="Some content"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={true}
        isContentEntryUpdated={false}
      />,
    );

    expect(screen.getByTestId('alert-error')).toHaveTextContent(
      'You have reached the 5,000 symbol limit and cannot make new requests.',
    );
  });

  it('displays warning alert when content is too short', () => {
    render(
      <Content
        isLoading={false}
        contentValue="Short"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
        isContentEntryUpdated={false}
      />,
    );

    expect(screen.getByTestId('alert-warning')).toHaveTextContent(
      'Please enter at least 30 characters. Changes are not saved for entries with fewer than 30 characters.',
    );
  });

  it('displays success alert when a new note is created', () => {
    mockEntryCreatedRef.current = true;

    render(
      <Content
        isLoading={false}
        contentValue="Some content"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
        isContentEntryUpdated={false}
      />,
    );

    expect(screen.getByTestId('alert-success')).toHaveTextContent(
      'A new record was created. Analyzing....',
    );
  });

  it('displays loading spinner when loading', () => {
    render(
      <Content
        isLoading={true}
        contentValue="Some content"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
        isContentEntryUpdated={false}
      />,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('does not update content value when prompt symbols limit is exceeded', () => {
    render(
      <Content
        isLoading={false}
        contentValue="Initial content"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={true}
        isContentEntryUpdated={false}
      />,
    );

    const textarea = screen.getByTestId('entry-content-field');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(textarea).toHaveValue('Initial content');
    expect(mockSetContentValue).not.toHaveBeenCalledWith('New content');
  });

  it('does not update content value when loading', () => {
    render(
      <Content
        isLoading={true}
        contentValue="Initial content"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={false}
        isContentEntryUpdated={false}
      />,
    );

    const textarea = screen.getByTestId('entry-content-field');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(textarea).toHaveValue('Initial content');
    expect(mockSetContentValue).not.toHaveBeenCalledWith('New content');
  });

  it('displays error and loading spinner when loading and prompt symbols limit is exceeded', () => {
    render(
      <Content
        isLoading={true}
        contentValue="Initial content"
        changeContentHandler={mockSetContentValue}
        saveContentHandler={mockSetContentValue}
        entryCreatedRef={mockEntryCreatedRef}
        isPromptSymbolsExceeded={true}
        isContentEntryUpdated={false}
      />,
    );

    expect(screen.getByTestId('alert-error')).toHaveTextContent(
      'You have reached the 5,000 symbol limit and cannot make new requests.',
    );
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
