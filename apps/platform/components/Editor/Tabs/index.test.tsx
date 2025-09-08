import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Tabs from '.';

// Mock dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/new-entry'),
}));

vi.mock('@repo/global-ui', () => ({
  Loading: ({ customClasses }: any) => <div data-testid="loading" className={customClasses}></div>,
}));

vi.mock('@/utils/constants', () => ({
  MINIMUM_CONTENT_LENGTH: 10,
}));

vi.mock('./FileUploadTabContent', () => ({
  default: ({ onFileSelectionChange, onFileSubmit }: any) => (
    <div data-testid="file-upload-tab-content">
      <button data-testid="mock-file-select" onClick={() => onFileSelectionChange(true)}>
        Select File
      </button>
      <button data-testid="mock-file-submit" onClick={() => onFileSubmit('Uploaded file content')}>
        Submit File
      </button>
    </div>
  ),
}));

vi.mock('./AlertMessages', () => ({
  AlertMessages: ({ isContentTooShort, isPromptSymbolsExceeded }: any) => (
    <div data-testid="alert-messages">
      {isContentTooShort && <div data-testid="alert-too-short">Content too short</div>}
      {isPromptSymbolsExceeded && <div data-testid="alert-symbols-exceeded">Symbols exceeded</div>}
    </div>
  ),
}));

describe('Tabs component', () => {
  const defaultProps = {
    isLoading: false,
    isContentEntryUpdated: false,
    isContentEntryCreated: false,
    contentValue: '',
    changeContentHandler: vi.fn(),
    saveContentHandler: vi.fn(),
    isPromptSymbolsExceeded: false,
  };

  it('renders with text tab active by default', () => {
    render(<Tabs {...defaultProps} />);

    // Check for textarea in text tab
    expect(screen.getByTestId('entry-content-field')).toBeInTheDocument();

    // Submit button should be disabled when content is empty
    const submitButton = screen.getByText('buttons.submitTextEntry');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('allows typing in the textarea', () => {
    render(<Tabs {...defaultProps} />);

    const textarea = screen.getByTestId('entry-content-field');
    fireEvent.change(textarea, { target: { value: 'Some test content' } });

    expect(defaultProps.changeContentHandler).toHaveBeenCalled();
  });

  it('enables submit button when content length is sufficient', () => {
    render(<Tabs {...defaultProps} contentValue="This is long enough content" />);

    const submitButton = screen.getByText('buttons.submitTextEntry');
    expect(submitButton).not.toBeDisabled();
  });

  it('displays loading state', () => {
    render(<Tabs {...defaultProps} isLoading={true} />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('displays alert when content is too short', () => {
    render(<Tabs {...defaultProps} contentValue="short" />);

    expect(screen.getByTestId('alert-messages')).toBeInTheDocument();
    expect(screen.getByTestId('alert-too-short')).toBeInTheDocument();
  });

  it('displays alert when prompt symbols are exceeded', () => {
    render(<Tabs {...defaultProps} isPromptSymbolsExceeded={true} />);

    expect(screen.getByTestId('alert-messages')).toBeInTheDocument();
    expect(screen.getByTestId('alert-symbols-exceeded')).toBeInTheDocument();
  });

  it('handles file selection from upload tab', () => {
    render(<Tabs {...defaultProps} />);

    // Click on upload tab radio button
    const uploadTab = screen.getByLabelText('tabs.uploadFileLabel');
    fireEvent.click(uploadTab);

    // File upload tab content should now be visible
    expect(screen.getByTestId('file-upload-tab-content')).toBeInTheDocument();

    // Simulate file selection
    fireEvent.click(screen.getByTestId('mock-file-select'));

    // changeContentHandler should be called with empty string to clear text tab
    expect(defaultProps.changeContentHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: '' },
      }),
    );
  });

  it('handles file submission', () => {
    render(<Tabs {...defaultProps} />);

    // Click on upload tab
    const uploadTab = screen.getByLabelText('tabs.uploadFileLabel');
    fireEvent.click(uploadTab);

    // Simulate file selection and submission
    fireEvent.click(screen.getByTestId('mock-file-select'));
    fireEvent.click(screen.getByTestId('mock-file-submit'));

    // changeContentHandler should be called with file content
    expect(defaultProps.changeContentHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: 'Uploaded file content' },
      }),
    );

    // saveContentHandler should be called
    expect(defaultProps.saveContentHandler).toHaveBeenCalled();
  });
});
