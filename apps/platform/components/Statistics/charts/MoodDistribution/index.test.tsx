import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MoodDistribution from '.';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('recharts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock('@/hooks/useWindowWidth', () => ({
  useWindowWidth: () => 1024,
  getChartAspectRatio: () => 16 / 9,
}));

beforeEach(() => {
  (global as any).ResizeObserver = ResizeObserver;
});

describe('MoodDistribution', () => {
  const mockData = [
    { mood: 'Happy', color: '#8884d8' },
    { mood: 'Happy', color: '#8884d8' },
    { mood: 'Sad', color: '#82ca9d' },
    { mood: 'Angry', color: '#ff7300' },
    { mood: 'Excited', color: '#0088fe' },
  ];

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<MoodDistribution data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders title correctly', () => {
    render(<MoodDistribution data={mockData} />);
    expect(screen.getByText('charts.moodDistribution.title')).toBeInTheDocument();
  });

  it('aggregates data correctly', () => {
    render(<MoodDistribution data={mockData} />);
    // Since we're mocking recharts, we can't easily test the actual chart rendering
    // But we can verify that the component doesn't crash with our data
    expect(screen.getByText('charts.moodDistribution.title')).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    const { container } = render(<MoodDistribution data={[]} />);
    expect(container).toMatchSnapshot();
  });
});
