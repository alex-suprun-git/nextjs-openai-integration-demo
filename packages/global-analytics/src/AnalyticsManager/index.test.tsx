import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsManager from './index';

// Mock GoogleTagManager
vi.mock('@next/third-parties/google', () => ({
	GoogleTagManager: vi.fn(() => <div data-testid="gtm-mock" />),
}));

describe('AnalyticsManager', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render GoogleTagManager with provided gtmId', () => {
		const { getByTestId } = render(<AnalyticsManager gtmId="GTM-XXXXX" />);
		expect(getByTestId('gtm-mock')).toBeInTheDocument();
	});
});
