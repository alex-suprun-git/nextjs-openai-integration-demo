import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterAll } from 'vitest';
import CookieBanner from './index';

// Create mock functions for js-cookie
const mockGet = vi.fn();
const mockSet = vi.fn();

// Mock js-cookie module
vi.mock('js-cookie', () => ({
	default: {
		get: mockGet,
		set: mockSet,
	},
}));

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
	});

	it('renders correctly with provided translations', () => {
		mockGet.mockReturnValue(null);

		render(<CookieBanner translations={mockTranslations} />);

		expect(screen.getByText(mockTranslations.title)).toBeInTheDocument();
		expect(screen.getByText(mockTranslations.description)).toBeInTheDocument();
		expect(screen.getByText(mockTranslations.acceptButton)).toBeInTheDocument();
		expect(screen.getByText(mockTranslations.rejectButton)).toBeInTheDocument();
	});

	it('does not render when cookie consent is already given', () => {
		mockGet.mockReturnValue('accepted');

		const { container } = render(
			<CookieBanner translations={mockTranslations} />
		);

		expect(container.firstChild).toBeNull();
	});

	it('sets cookie and hides banner when accepting', () => {
		mockGet.mockReturnValue(null);

		render(<CookieBanner translations={mockTranslations} />);

		fireEvent.click(screen.getByText(mockTranslations.acceptButton));

		expect(mockSet).toHaveBeenCalledWith('gdpr-consent', 'accepted', {
			expires: 7,
		});
	});

	it('redirects to Google when rejecting', () => {
		mockGet.mockReturnValue(null);

		render(<CookieBanner translations={mockTranslations} />);

		fireEvent.click(screen.getByText(mockTranslations.rejectButton));

		expect(window.location.href).toBe('https://www.google.com');
	});

	// Restore original window.location after all tests
	afterAll(() => {
		Object.defineProperty(window, 'location', {
			configurable: true,
			value: originalLocation,
		});
	});
});
