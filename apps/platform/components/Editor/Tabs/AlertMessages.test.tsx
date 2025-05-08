import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AlertMessages } from './AlertMessages';

// Mock dependencies
vi.mock('@repo/global-ui', () => ({
  Alert: ({ type, children, testId }: any) => (
    <div data-testid={testId || `alert-${type}`}>{children}</div>
  ),
}));

describe('AlertMessages component', () => {
  const defaultProps = {
    t: (key: string) => key,
  };

  it('renders nothing when no alerts are triggered', () => {
    const { container } = render(<AlertMessages {...defaultProps} />);

    // No alert elements should be rendered
    expect(container.firstChild).toBeNull();
  });

  it('displays error alert when prompt symbols are exceeded', () => {
    render(<AlertMessages {...defaultProps} isPromptSymbolsExceeded={true} />);

    // Should render error alert
    const alert = screen.getByTestId('alert-error');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('alerts.symbolsLimitExceeded');
  });

  it('displays warning alert when content is too short', () => {
    render(<AlertMessages {...defaultProps} isContentTooShort={true} />);

    // Should render warning alert
    const alert = screen.getByTestId('alert-warning');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('alerts.contentTooShort');
  });

  it('displays success alert when content entry is created', () => {
    render(<AlertMessages {...defaultProps} isContentEntryCreated={true} />);

    // Should render success alert
    const alert = screen.getByTestId('alert-success');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('alerts.entryCreated');
  });

  it('displays success alert when content entry is updated', () => {
    render(<AlertMessages {...defaultProps} isContentEntryUpdated={true} />);

    // Should render success alert
    const alert = screen.getByTestId('alert-success');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('alerts.entryUpdated');
  });

  it('displays file read error alert', () => {
    render(<AlertMessages {...defaultProps} fileReadError="Error reading file" />);

    // Should render error alert
    const alert = screen.getByTestId('alert-error');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Error reading file');
  });

  it('displays success alert when file preview is ready', () => {
    const translateMock = vi.fn().mockImplementation((key) => {
      if (key === 'alerts.filePreviewReady') return 'File preview ready';
      return key;
    });

    render(<AlertMessages t={translateMock} fileReadError="File preview ready" />);

    // Should render success alert
    const alert = screen.getByTestId('alert-success');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('File preview ready');
  });

  it('can display multiple alerts at once', () => {
    render(
      <AlertMessages {...defaultProps} isContentTooShort={true} isContentEntryCreated={true} />,
    );

    // Should render both alerts
    expect(screen.getByTestId('alert-warning')).toBeInTheDocument();
    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
  });
});
