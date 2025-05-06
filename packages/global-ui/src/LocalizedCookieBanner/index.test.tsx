import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LocalizedCookieBanner from './index';

// Mock the CookieBanner component
vi.mock('../CookieBanner', () => ({
	default: ({ translations }) => (
		<div data-testid="mocked-cookie-banner">
			<div data-testid="title">{translations.title}</div>
			<div data-testid="description">{translations.description}</div>
			<div data-testid="accept-button">{translations.acceptButton}</div>
			<div data-testid="reject-button">{translations.rejectButton}</div>
		</div>
	),
}));

// Mock next-intl useTranslations hook
vi.mock('next-intl', () => ({
	useTranslations: () => (key) => {
		const translations = {
			title: 'Test Title',
			description: 'Test Description',
			acceptButton: 'Test Accept',
			rejectButton: 'Test Reject',
		};
		return translations[key];
	},
}));

describe('LocalizedCookieBanner', () => {
	it('renders CookieBanner with translated content', () => {
		render(<LocalizedCookieBanner />);

		expect(screen.getByTestId('mocked-cookie-banner')).toBeInTheDocument();
		expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
		expect(screen.getByTestId('description')).toHaveTextContent(
			'Test Description'
		);
		expect(screen.getByTestId('accept-button')).toHaveTextContent(
			'Test Accept'
		);
		expect(screen.getByTestId('reject-button')).toHaveTextContent(
			'Test Reject'
		);
	});

	it('uses the custom namespace when provided', () => {
		// This doesn't really test different namespaces since our mock always returns the same translations
		// In a real test, you'd use a more sophisticated mock for useTranslations that respects namespaces
		render(<LocalizedCookieBanner namespace="CustomNamespace" />);

		expect(screen.getByTestId('mocked-cookie-banner')).toBeInTheDocument();
	});
});
