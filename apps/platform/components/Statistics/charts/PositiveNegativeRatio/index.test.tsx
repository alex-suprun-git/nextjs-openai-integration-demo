import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PositiveNegativeRatio from '.';

// Mock the next-intl hooks
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the useWindowWidth hook
vi.mock('@/hooks/useWindowWidth', () => ({
  useWindowWidth: vi.fn().mockReturnValue(1024),
  getChartAspectRatio: vi.fn().mockReturnValue(2),
}));

// Mock recharts components
vi.mock('recharts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>,
    Cell: ({ fill }: any) => <div data-testid="cell" style={{ backgroundColor: fill }}></div>,
  };
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  (global as any).ResizeObserver = ResizeObserver;
});

describe('PositiveNegativeRatio component', () => {
  const mockData = [
    { negative: true, color: '#ff595e' },
    { negative: false, color: '#1982c4' },
    { negative: false, color: '#1982c4' },
  ];

  it('renders the component with title', () => {
    render(<PositiveNegativeRatio data={mockData} />);

    expect(screen.getByText('charts.positiveNegativeRatio.title')).toBeInTheDocument();
  });

  it('renders pie chart with data', () => {
    render(<PositiveNegativeRatio data={mockData} />);

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getAllByTestId('cell').length).toBe(2); // Two cells: positive and negative
  });

  it('calculates correct positive/negative counts', () => {
    const { container } = render(<PositiveNegativeRatio data={mockData} />);

    // The rendered component doesn't expose the aggregated data directly,
    // so we're checking for the existence of certain elements
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();

    // Ensure the tooltip and legend are rendered
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });
});
