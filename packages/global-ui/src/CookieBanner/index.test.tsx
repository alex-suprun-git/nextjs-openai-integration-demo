import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterAll } from 'vitest';
import Cookies from 'js-cookie';
import CookieBanner from './index';

// Mock js-cookie module properly for Vitest
vi.mock('js-cookie');

// Mock window.location
const originalLocation = window.location;

// Instead of deleting property, redefine it
Object.defineProperty(window, 'location', {
	configurable: true,
	writable: true,
	value: { href: '' },
});

describe('CookieBanner', () => {
	const mockTranslations = {
		title: 'Cookies Policy',
		description: 'We use cookies to improve your experience.',
		acceptButton: 'Accept',
		rejectButton: 'Reject',
	};

	beforeEach(() => {
		vi.resetAllMocks();
		vi.mocked(Cookies.get).mockImplementation((name?: string): any => {
			if (name === undefined) {
				return {};
			}
			return undefined;
		});
	});

	it('renders correctly with provided translations', () => {
		render(<CookieBanner translations={mockTranslations} />);

		expect(screen.getByText(mockTranslations.title)).toBeInTheDocument();
		expect(screen.getByText(mockTranslations.description)).toBeInTheDocument();
		expect(screen.getByText(mockTranslations.acceptButton)).toBeInTheDocument();
		expect(screen.getByText(mockTranslations.rejectButton)).toBeInTheDocument();
	});

	it('does not render when cookie consent is already given', () => {
		// Redefine moc for this particular test
		vi.mocked(Cookies.get).mockImplementation((name?: string): any => {
			if (name === undefined) {
				return {};
			}
			if (name === 'gdpr-consent') {
				return 'accepted';
			}
			return undefined;
		});

		const { container } = render(
			<CookieBanner translations={mockTranslations} />
		);

		expect(container.firstChild).toBeNull();
	});

	it('sets cookie and hides banner when accepting', () => {
		render(<CookieBanner translations={mockTranslations} />);

		fireEvent.click(screen.getByText(mockTranslations.acceptButton));

		expect(vi.mocked(Cookies.set)).toHaveBeenCalledWith(
			'gdpr-consent',
			'accepted',
			{
				expires: 7,
				domain: '.nextjs-ai-platform.site',
			}
		);
	});

	it('sets rejected cookie and calls onReject when rejecting', () => {
		const mockOnReject = vi.fn();

		render(
			<CookieBanner translations={mockTranslations} onReject={mockOnReject} />
		);

		fireEvent.click(screen.getByText(mockTranslations.rejectButton));

		expect(vi.mocked(Cookies.set)).toHaveBeenCalledWith(
			'gdpr-consent',
			'rejected',
			{
				expires: 7,
				domain: '.nextjs-ai-platform.site',
			}
		);
		expect(mockOnReject).toHaveBeenCalled();
	});

	// Restore original window.location after all tests
	afterAll(() => {
		Object.defineProperty(window, 'location', {
			configurable: true,
			value: originalLocation,
		});
	});
});
