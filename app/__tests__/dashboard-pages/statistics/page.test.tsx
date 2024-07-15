import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import History from '@/app/(dashboard)/statistics/page';
import { getUserByClerkId } from '@/utils/auth';
import { prisma } from '@/utils/db';

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

vi.mock('@/components/HistoryChart', () => ({
  default: ({ data }: { data: any }) => (
    <div data-testid="history-chart">{JSON.stringify(data)}</div>
  ),
}));

vi.mock('@/ui-lib', () => ({
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

describe('History', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render no data message when there is no data', async () => {
    // Arrange
    const mockUser = { id: 'user-123' };
    (getUserByClerkId as Mock).mockResolvedValue(mockUser);
    (prisma.analysis.findMany as Mock).mockResolvedValue([]);

    // Act
    render(<div>{await History()}</div>);

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
    render(<div>{await History()}</div>);

    // Assert
    expect(await screen.findByText('Statistics')).toBeInTheDocument();
    expect(await screen.findByText(`Average sentiment: ${averageSentiment}`)).toBeInTheDocument();
    expect(await screen.findByTestId('history-chart')).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(mockAnalyses))).toBeInTheDocument();
  });
});
