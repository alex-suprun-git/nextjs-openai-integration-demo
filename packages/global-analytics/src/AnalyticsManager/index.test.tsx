import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cookies from 'js-cookie';
import AnalyticsManager from './index';

// Mock js-cookie
vi.mock('js-cookie', () => ({
	default: {
		get: vi.fn(),
	},
}));

// Mock GoogleTagManager
vi.mock('@next/third-parties/google', () => ({
	GoogleTagManager: vi.fn(() => <div data-testid="gtm-mock" />),
}));

describe('AnalyticsManager', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render GoogleTagManager when consent is accepted', () => {
		// Setup
		const mockGet = Cookies.get as jest.Mock;
		mockGet.mockReturnValue('accepted');

		// Act
		const { getByTestId } = render(<AnalyticsManager gtmId="GTM-XXXXX" />);

		// Assert
		expect(mockGet).toHaveBeenCalledWith('gdpr-consent');
		expect(getByTestId('gtm-mock')).toBeInTheDocument();
	});

	it('should not render GoogleTagManager when consent is rejected', () => {
		// Setup
		const mockGet = Cookies.get as jest.Mock;
		mockGet.mockReturnValue('rejected');

		// Act
		const { queryByTestId } = render(<AnalyticsManager gtmId="GTM-XXXXX" />);

		// Assert
		expect(mockGet).toHaveBeenCalledWith('gdpr-consent');
		expect(queryByTestId('gtm-mock')).not.toBeInTheDocument();
	});

	it('should not render GoogleTagManager when no consent is found', () => {
		// Setup
		const mockGet = Cookies.get as jest.Mock;
		mockGet.mockReturnValue(undefined);

		// Act
		const { queryByTestId } = render(<AnalyticsManager gtmId="GTM-XXXXX" />);

		// Assert
		expect(mockGet).toHaveBeenCalledWith('gdpr-consent');
		expect(queryByTestId('gtm-mock')).not.toBeInTheDocument();
	});

	it('should use custom cookie name when provided', () => {
		// Setup
		const mockGet = Cookies.get as jest.Mock;
		mockGet.mockReturnValue('accepted');

		// Act
		render(<AnalyticsManager gtmId="GTM-XXXXX" cookieName="custom-cookie" />);

		// Assert
		expect(mockGet).toHaveBeenCalledWith('custom-cookie');
	});

	it('should use custom accepted value when provided', () => {
		// Setup
		const mockGet = Cookies.get as jest.Mock;
		mockGet.mockReturnValue('yes');

		// Act
		const { getByTestId } = render(
			<AnalyticsManager gtmId="GTM-XXXXX" acceptedValue="yes" />
		);

		// Assert
		expect(getByTestId('gtm-mock')).toBeInTheDocument();
	});
});
