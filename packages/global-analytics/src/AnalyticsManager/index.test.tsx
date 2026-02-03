import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsManager from './index';

// Mock GoogleTagManager
vi.mock('@next/third-parties/google', () => ({
	GoogleTagManager: vi.fn(() => <div data-testid="gtm-mock" />),
}));

// Mock useConsentManager hook
vi.mock('@c15t/react', () => ({
	useConsentManager: vi.fn(),
}));

describe('AnalyticsManager', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render GoogleTagManager when user has consented to measurement', async () => {
		const { useConsentManager } = await import('@c15t/react');
		(useConsentManager as ReturnType<typeof vi.fn>).mockReturnValue({
			has: vi.fn().mockReturnValue(true),
		});

		const { getByTestId } = render(<AnalyticsManager gtmId="GTM-XXXXX" />);
		expect(getByTestId('gtm-mock')).toBeInTheDocument();
	});

	it('should not render GoogleTagManager when user has not consented to measurement', async () => {
		const { useConsentManager } = await import('@c15t/react');
		(useConsentManager as ReturnType<typeof vi.fn>).mockReturnValue({
			has: vi.fn().mockReturnValue(false),
		});

		const { queryByTestId } = render(<AnalyticsManager gtmId="GTM-XXXXX" />);
		expect(queryByTestId('gtm-mock')).not.toBeInTheDocument();
	});

	it('should check for measurement category consent', async () => {
		const mockHas = vi.fn().mockReturnValue(true);
		const { useConsentManager } = await import('@c15t/react');
		(useConsentManager as ReturnType<typeof vi.fn>).mockReturnValue({
			has: mockHas,
		});

		render(<AnalyticsManager gtmId="GTM-XXXXX" />);
		expect(mockHas).toHaveBeenCalledWith('measurement');
	});
});
