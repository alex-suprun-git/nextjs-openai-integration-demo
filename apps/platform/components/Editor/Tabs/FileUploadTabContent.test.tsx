import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileUploadTabContent from './FileUploadTabContent';

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
  AlertMessages: ({ fileReadError, isContentTooShort, t }: any) => (
    <div data-testid="alert-messages">
      {fileReadError && <div data-testid="file-error">{fileReadError}</div>}
      {isContentTooShort && <div data-testid="content-too-short">Content too short</div>}
    </div>
  ),
}));

describe('FileUploadTabContent without file', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock with no file selected
    vi.mock('@/hooks/useFileProcessor', () => ({
      useFileProcessor: () => ({
        selectedFile: null,
        filePreviewContent: '',
        fileReadError: null,
        isContentValid: false,
        isContentTooShort: false,
        processFile: processFileMock.mockResolvedValue(true),
        resetFileSelection: resetFileSelectionMock,
      }),
    }));
  });

  it('renders the file dropzone when no file is selected', () => {
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: vi.fn(),
      onFileSubmit: vi.fn(),
    };

    render(<FileUploadTabContent {...props} />);

    // Check for dropzone elements
    expect(screen.getByText('dropzone.promptMain')).toBeInTheDocument();
    expect(screen.getByText('dropzone.promptDetails')).toBeInTheDocument();
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
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

    const { container } = render(<FileUploadTabContent {...props} />);

    // Get the file input (it's hidden so we need to find it by id)
    const fileInput = container.querySelector('#dropzone-file-inner');
    expect(fileInput).toBeInTheDocument();

    if (fileInput) {
      const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
      await fireEvent.change(fileInput, { target: { files: [file] } });

      expect(processFileMock).toHaveBeenCalled();
      expect(onFileSelectionChangeMock).toHaveBeenCalledWith(true);
    }
  });
});

describe('FileUploadTabContent with file selected', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock with a file selected
    vi.mock('@/hooks/useFileProcessor', () => ({
      useFileProcessor: () => ({
        selectedFile: { name: 'test.txt' },
        filePreviewContent: 'This is a file content preview',
        fileReadError: null,
        isContentValid: true,
        isContentTooShort: false,
        processFile: processFileMock,
        resetFileSelection: resetFileSelectionMock,
      }),
    }));
  });

  it('displays file info and preview when file is selected', () => {
    const props = {
      isLoading: false,
      isNewEntry: true,
      t: (key: string) => key,
      onFileSelectionChange: vi.fn(),
      onFileSubmit: vi.fn(),
    };

    render(<FileUploadTabContent {...props} />);

    // Verify file info panel is shown
    expect(screen.getByText('labels.selectedFilePrompt')).toBeInTheDocument();
    expect(screen.getByText('test.txt')).toBeInTheDocument();

    // Verify preview is shown
    expect(screen.getByText('labels.previewArea')).toBeInTheDocument();
    const previewArea = screen.getByDisplayValue('This is a file content preview');
    expect(previewArea).toBeInTheDocument();

    // Verify submit button is shown
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

    render(<FileUploadTabContent {...props} />);

    // Click submit button
    fireEvent.click(screen.getByText('buttons.submitPreviewForAnalysis'));

    // Verify onFileSubmit was called with file content
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

    render(<FileUploadTabContent {...props} />);

    // Click remove button
    fireEvent.click(screen.getByLabelText('buttons.removeSelectedFile'));

    // Verify resetFileSelection and onFileSelectionChange were called
    expect(resetFileSelectionMock).toHaveBeenCalled();
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

    render(<FileUploadTabContent {...props} />);

    // Verify submit button is disabled
    const submitButton = screen.getByText('buttons.submitPreviewForAnalysis');
    expect(submitButton).toBeDisabled();
  });
});
