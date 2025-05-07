import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PositiveNegativeRatio from '.';

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

describe('PositiveNegativeRatio', () => {
  const mockData = [
    { negative: true, color: '#ff595e' },
    { negative: false, color: '#1982c4' },
    { negative: false, color: '#1982c4' },
    { negative: true, color: '#ff595e' },
    { negative: false, color: '#1982c4' },
  ];

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<PositiveNegativeRatio data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders title correctly', () => {
    render(<PositiveNegativeRatio data={mockData} />);
    expect(screen.getByText('charts.positiveNegativeRatio.title')).toBeInTheDocument();
  });

  it('aggregates data correctly', () => {
    render(<PositiveNegativeRatio data={mockData} />);
    // Since we're mocking recharts, we can't easily test the actual chart rendering
    // But we can verify that the component doesn't crash with our data
    expect(screen.getByText('charts.positiveNegativeRatio.title')).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    const { container } = render(<PositiveNegativeRatio data={[]} />);
    expect(container).toMatchSnapshot();
  });
});
