import '@testing-library/jest-dom/vitest';
import { act, render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsManager from './index';

type UsercentricsMock = {
	initPromise: Promise<unknown>;
	getConsents: () => Promise<unknown>;
};

function setUsercentricsMock(mock: UsercentricsMock | undefined) {
	const g = globalThis as typeof globalThis & { UC_UI?: UsercentricsMock };
	if (mock) g.UC_UI = mock;
	else delete g.UC_UI;
}

// Mock GoogleTagManager
vi.mock('@next/third-parties/google', () => ({
	GoogleTagManager: vi.fn(() => <div data-testid="gtm-mock" />),
}));

describe('AnalyticsManager', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		setUsercentricsMock(undefined);
	});

	it('should render GoogleTagManager when Usercentrics reports consent for GTM', async () => {
		setUsercentricsMock({
			initPromise: Promise.resolve(),
			getConsents: vi.fn().mockResolvedValue([
				{ templateId: 'BJ59EidsWQ', consent: true },
			]),
		});

		const { findByTestId } = render(
			<AnalyticsManager gtmId="GTM-XXXXX" usercentricsServiceId="BJ59EidsWQ" />
		);
		expect(await findByTestId('gtm-mock')).toBeInTheDocument();
	});

	it('should not render GoogleTagManager when Usercentrics reports no consent for GTM', async () => {
		setUsercentricsMock({
			initPromise: Promise.resolve(),
			getConsents: vi.fn().mockResolvedValue([
				{ templateId: 'BJ59EidsWQ', consent: false },
			]),
		});

		const { queryByTestId } = render(
			<AnalyticsManager gtmId="GTM-XXXXX" usercentricsServiceId="BJ59EidsWQ" />
		);
		await waitFor(() => {
			expect(queryByTestId('gtm-mock')).not.toBeInTheDocument();
		});
	});

	it('should use custom Usercentrics service name when provided', async () => {
		setUsercentricsMock({
			initPromise: Promise.resolve(),
			getConsents: vi.fn().mockResolvedValue([
				{ name: 'My GTM Service', consent: true },
			]),
		});

		const { findByTestId } = render(
			<AnalyticsManager
				gtmId="GTM-XXXXX"
				usercentricsServiceName="My GTM Service"
			/>
		);

		expect(await findByTestId('gtm-mock')).toBeInTheDocument();
	});

	it('should enable GTM after a Usercentrics consent window event', async () => {
		const getConsents = vi
			.fn()
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([{ templateId: 'BJ59EidsWQ', consent: true }]);
		setUsercentricsMock({
			initPromise: Promise.resolve(),
			getConsents,
		});

		const { queryByTestId } = render(
			<AnalyticsManager gtmId="GTM-XXXXX" usercentricsServiceId="BJ59EidsWQ" />
		);
		expect(queryByTestId('gtm-mock')).not.toBeInTheDocument();

		// Ensure effects have run (listeners attached + initial UC read).
		await waitFor(() => expect(getConsents).toHaveBeenCalled());

		await act(async () => {
			window.dispatchEvent(
				new CustomEvent('ucEvent', {
					detail: {
						event: 'consent_status',
						'Google Tag Manager': true,
					},
				})
			);
		});

		await waitFor(() => {
			expect(queryByTestId('gtm-mock')).toBeInTheDocument();
		});
	});

	it('should re-check consents when UC_UI_INITIALIZED fires', async () => {
		const getConsents = vi
			.fn()
			.mockResolvedValueOnce([]) // initial check: not enabled
			.mockResolvedValueOnce([{ templateId: 'BJ59EidsWQ', consent: true }]); // after init event

		setUsercentricsMock({
			initPromise: Promise.resolve(),
			getConsents,
		});

		const { queryByTestId } = render(
			<AnalyticsManager gtmId="GTM-XXXXX" usercentricsServiceId="BJ59EidsWQ" />
		);
		expect(queryByTestId('gtm-mock')).not.toBeInTheDocument();

		await act(async () => {
			window.dispatchEvent(new CustomEvent('UC_UI_INITIALIZED', { detail: {} }));
		});

		await waitFor(() => {
			expect(queryByTestId('gtm-mock')).toBeInTheDocument();
		});
	});
});
