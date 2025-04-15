import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTranslator, useTranslations } from 'next-intl';
import StatisticsPage from '@/app/statistics/page';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock the dependencies
vi.mock('@/utils/auth', () => ({
  getUserByClerkId: vi.fn(),
}));

vi.mock('@/utils/db', () => ({
  prisma: {
    analysis: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@/components/Statistics/HistoryChart', () => ({
  default: ({ data }: { data: any }) => (
    <div data-testid="history-chart">{JSON.stringify(data)}</div>
  ),
}));

vi.mock('@/ui-lib', () => ({
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

describe('StatisticsPage', () => {
  beforeEach(async () => {
    (global as any).ResizeObserver = ResizeObserver;
    const translate = createTranslator({
      locale: 'en',
      namespace: 'StatisticsPage',
      messages: (await import('@/messages/en.json')).default,
    });

    (useTranslations as Mock).mockImplementation(() => translate);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render no data message when there is no data', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.analysis.findMany as Mock).mockResolvedValue([]);

    // Act
    render(<div>{await StatisticsPage()}</div>);

    // Assert
    expect(await screen.findByText('Statistics')).toBeInTheDocument();
    expect(await screen.findByText('There is no data to display yet.')).toBeInTheDocument();
  });

  it('should render HistoryChart with data when data is available', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    const mockAnalyses = [
      { sentimentScore: 3, createdAt: new Date('2023-01-01') },
      { sentimentScore: 7, createdAt: new Date('2023-02-01') },
    ];
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.analysis.findMany as Mock).mockResolvedValue(mockAnalyses);

    const averageSentiment = Math.round(
      mockAnalyses.reduce((acc, { sentimentScore }) => acc + sentimentScore, 0) /
        mockAnalyses.length,
    );

    // Act
    render(<div>{await StatisticsPage()}</div>);

    // Assert
    expect(await screen.findByText('Statistics')).toBeInTheDocument();
    expect(await screen.findByText(`Average sentiment: ${averageSentiment}`)).toBeInTheDocument();
    expect(await screen.findByTestId('history-chart')).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(mockAnalyses))).toBeInTheDocument();
  });
});
