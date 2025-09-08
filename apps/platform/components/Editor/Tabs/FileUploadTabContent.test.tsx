import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Define a common resetFileSelectionMock to reuse
const resetFileSelectionMock = vi.fn();
const processFileMock = vi.fn();

// Mock the react-icons components
vi.mock('react-icons/fi', () => ({
  FiUploadCloud: () => <div data-testid="upload-icon" />,
  FiXCircle: () => <div data-testid="remove-icon" />,
}));

// Mock alert messages
vi.mock('./AlertMessages', () => ({
  AlertMessages: ({ fileReadError, isContentTooShort }: any) => (
    <div data-testid="alert-messages">
      {fileReadError && <div data-testid="file-error">{fileReadError}</div>}
      {isContentTooShort && <div data-testid="content-too-short">Content too short</div>}
    </div>
  ),
}));

let FileUploadTabContentComponent: any;

describe('FileUploadTabContent without file', () => {
  beforeEach(async () => {
    vi.resetModules(); // Reset modules before setting new mocks
    vi.doMock('@/hooks/useFileProcessor', () => ({
      useFileProcessor: vi.fn(() => ({
        selectedFile: null,
        filePreviewContent: '',
        fileReadError: null,
        isContentValid: false,
        isContentTooShort: false,
        processFile: processFileMock.mockResolvedValue(true), // processFileMock will be used here
        resetFileSelection: resetFileSelectionMock,
      })),
    }));
    const importedModule = await import('./FileUploadTabContent');
    FileUploadTabContentComponent = importedModule.default;

    // Clear mocks that are defined in the outer scope
    processFileMock.mockClear();
    resetFileSelectionMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the file dropzone when no file is selected', () => {
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: vi.fn(),
      onFileSubmit: vi.fn(),
    };

    const { container } = render(<FileUploadTabContentComponent {...props} />);

    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    expect(screen.getByText('dropzone.promptMain')).toBeInTheDocument();
    expect(screen.getByText('dropzone.promptDetails')).toBeInTheDocument();
    const fileInput = container.querySelector('#dropzone-file-inner');
    expect(fileInput).toBeInTheDocument();
  });

  it('calls processFile when a file is selected', async () => {
    const onFileSelectionChangeMock = vi.fn();
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: onFileSelectionChangeMock,
      onFileSubmit: vi.fn(),
    };

    const { container } = render(<FileUploadTabContentComponent {...props} />);

    const inputElement = container.querySelector('#dropzone-file-inner');
    expect(inputElement).toBeInTheDocument(); // Make sure the input is rendered

    if (!inputElement) throw new Error('File input #dropzone-file-inner not found');

    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    await fireEvent.change(inputElement, { target: { files: [file] } });

    expect(processFileMock).toHaveBeenCalledTimes(1);
    expect(processFileMock).toHaveBeenCalledWith(file);
    // Since processFileMock is mocked to resolve to true in this suite's beforeEach
    expect(onFileSelectionChangeMock).toHaveBeenCalledWith(true);
  });
});

describe('FileUploadTabContent with file selected', () => {
  beforeEach(async () => {
    vi.resetModules(); // Reset modules before setting new mocks
    vi.doMock('@/hooks/useFileProcessor', () => ({
      useFileProcessor: vi.fn(() => ({
        selectedFile: { name: 'test.txt' },
        filePreviewContent: 'This is a file content preview',
        fileReadError: null,
        isContentValid: true,
        isContentTooShort: false,
        processFile: processFileMock, // Re-use global mock, its behavior might be set if needed per test
        resetFileSelection: resetFileSelectionMock,
      })),
    }));
    const importedModule = await import('./FileUploadTabContent');
    FileUploadTabContentComponent = importedModule.default;

    // Clear mocks that are defined in the outer scope
    processFileMock.mockClear();
    resetFileSelectionMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays file info and preview when file is selected', () => {
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: vi.fn(),
      onFileSubmit: vi.fn(),
    };

    render(<FileUploadTabContentComponent {...props} />);

    expect(screen.getByText('labels.selectedFilePrompt')).toBeInTheDocument();
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText('labels.previewArea')).toBeInTheDocument();
    const previewArea = screen.getByDisplayValue('This is a file content preview');
    expect(previewArea).toBeInTheDocument();
    expect(screen.getByText('buttons.submitPreviewForAnalysis')).toBeInTheDocument();
  });

  it('calls onFileSubmit when submit button is clicked', () => {
    const onFileSubmitMock = vi.fn();
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: vi.fn(),
      onFileSubmit: onFileSubmitMock,
    };

    render(<FileUploadTabContentComponent {...props} />);
    fireEvent.click(screen.getByText('buttons.submitPreviewForAnalysis'));
    expect(onFileSubmitMock).toHaveBeenCalledWith('This is a file content preview');
  });

  it('calls resetFileSelection when remove button is clicked', () => {
    const onFileSelectionChangeMock = vi.fn();
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: onFileSelectionChangeMock,
      onFileSubmit: vi.fn(),
    };

    render(<FileUploadTabContentComponent {...props} />);
    // Assuming t('buttons.removeSelectedFile') is the label for the button
    fireEvent.click(screen.getByLabelText('buttons.removeSelectedFile'));
    expect(resetFileSelectionMock).toHaveBeenCalledTimes(1);
    expect(onFileSelectionChangeMock).toHaveBeenCalledWith(false);
  });

  it('disables submit button when loading', () => {
    const props = {
      isLoading: true,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: vi.fn(),
      onFileSubmit: vi.fn(),
    };

    render(<FileUploadTabContentComponent {...props} />);
    const submitButton = screen.getByText('buttons.submitPreviewForAnalysis');
    expect(submitButton).toBeDisabled();
  });
});
