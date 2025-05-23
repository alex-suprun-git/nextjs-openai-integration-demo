import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HistoryChart from '.';

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

beforeEach(() => {
  (global as any).ResizeObserver = ResizeObserver;
});

describe('HistoryChart', () => {
  const mockData = [
    { sentimentScore: 1, createdAt: '2023-01-01T00:00:00Z', mood: 'Happy', color: 'green' },
    { sentimentScore: 0, createdAt: '2023-01-02T00:00:00Z', mood: 'Neutral', color: 'gray' },
  ] as any[];

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<HistoryChart data={mockData} />);
    expect(container).toMatchSnapshot();
  });

  it('renders tooltip correctly when active and data is present', async () => {
    render(<HistoryChart data={mockData} />);

    // Simulate the Tooltip being active
    const activeTooltipData = {
      sentimentScore: 1,
      createdAt: '2023-01-01',
      mood: 'Happy',
      color: 'green',
    };

    render(
      <div
        data-testid="custom-tooltip"
        className="custom-tooltip relative rounded-lg border border-black/10 bg-white/5 p-8 shadow-md backdrop-blur-md"
      >
        <div
          className="absolute left-2 top-2 h-2 w-2 rounded-full"
          style={{ background: activeTooltipData.color }}
        ></div>
        <p className="label text-sm">{activeTooltipData.createdAt}</p>
        <p className="intro text-xl uppercase">{activeTooltipData.mood}</p>
      </div>,
    );

    const tooltipElement = screen.getByTestId('custom-tooltip');
    expect(tooltipElement).toBeInTheDocument();

    const labelElement = within(tooltipElement!).getByText('2023-01-01');
    expect(labelElement).toBeInTheDocument();

    const moodElement = within(tooltipElement!).getByText('Happy');
    expect(moodElement).toBeInTheDocument();
  });

  it('renders correctly with empty data', () => {
    const { container } = render(<HistoryChart data={[]} />);
    expect(container).toMatchSnapshot();
    expect(screen.queryByText(/2023-01-01/i)).not.toBeInTheDocument();
  });
});
