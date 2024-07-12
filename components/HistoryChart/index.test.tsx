import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HistoryChart from '.';
import { createElement } from 'react';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.mock('recharts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: () => createElement('div'),
  };
});

beforeEach(() => {
  (global as any).ResizeObserver = ResizeObserver;
});

describe('HistoryChart', () => {
  const mockData = [
    { sentimentScore: 1, updatedAt: '2023-01-01T00:00:00Z', mood: 'Happy', color: '#ff0000' },
    { sentimentScore: 0, updatedAt: '2023-01-02T00:00:00Z', mood: 'Neutral', color: '#00ff00' },
  ] as any[];

  it('renders correctly and matches snapshot', () => {
    const { container } = render(<HistoryChart data={mockData} />);
    expect(container).toMatchSnapshot();
  });
});
