import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { createTranslator, useTranslations } from 'next-intl';
import AnalysisSidebar from '.';
import { deleteEntry } from '@/utils/api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Mock the dependencies
vi.mock('@/utils/api', () => ({
  deleteEntry: vi.fn(),
}));

vi.mock('next/dist/shared/lib/app-router-context.shared-runtime', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/utils/helpers', () => ({
  convertHexToRGBA: vi.fn().mockReturnValue('rgba(0, 0, 0, 0.25)'),
  getMoodImage: vi.fn().mockReturnValue('url(/path/to/image.jpg)'),
}));

describe('AnalysisSidebar', () => {
  const mockRouter = {
    push: vi.fn(),
    refresh: vi.fn(),
  } as unknown as AppRouterInstance;

  const mockAnalysis = {
    summary: 'Test Summary',
    subject: 'Test Subject',
    mood: 'Happy',
    color: 'green',
    negative: false,
    sentimentScore: 8,
  };

  const mockEntryId = '12345';

  beforeEach(async () => {
    const translate = createTranslator({
      locale: 'en',
      namespace: 'Editor',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders analysis data correctly', () => {
    render(<AnalysisSidebar analysis={mockAnalysis} router={mockRouter} />);

    expect(screen.getByText('Summary:')).toBeInTheDocument();
    expect(screen.getByText('Test Summary')).toBeInTheDocument();
    expect(screen.getByText('Subject:')).toBeInTheDocument();
    expect(screen.getByText('Test Subject')).toBeInTheDocument();
    expect(screen.getByText('Mood:')).toBeInTheDocument();
    expect(screen.getByText('Happy')).toBeInTheDocument();
    expect(screen.getByText('Negative:')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  it('calls deleteEntryHandler when delete button is clicked', async () => {
    render(<AnalysisSidebar entryId={mockEntryId} analysis={mockAnalysis} router={mockRouter} />);

    const deleteButton = screen.getByText(/Delete this note/i);
    fireEvent.click(deleteButton);

    expect(deleteEntry).toHaveBeenCalledWith(mockEntryId);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/journal');
    });
    await waitFor(() => {
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});
