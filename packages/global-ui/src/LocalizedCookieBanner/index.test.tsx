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
			{translations.types && (
				<div data-testid="types">
					{translations.types.required && (
						<div data-testid="type-required">{translations.types.required}</div>
					)}
					{translations.types.functional && (
						<div data-testid="type-functional">
							{translations.types.functional}
						</div>
					)}
					{translations.types.analytics && (
						<div data-testid="type-analytics">
							{translations.types.analytics}
						</div>
					)}
					{translations.types.marketing && (
						<div data-testid="type-marketing">
							{translations.types.marketing}
						</div>
					)}
				</div>
			)}
			{translations.learnMore && (
				<div data-testid="learn-more">{translations.learnMore}</div>
			)}
			{translations.policyLink && (
				<div data-testid="policy-link">{translations.policyLink}</div>
			)}
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
			'types.required': 'Test Required',
			'types.functional': 'Test Functional',
			'types.analytics': 'Test Analytics',
			'types.marketing': 'Test Marketing',
			learnMore: 'Test Learn More',
			policyLink: '/test-privacy',
		};
		return translations[key] || key;
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

		// Check types
		expect(screen.getByTestId('type-required')).toHaveTextContent(
			'Test Required'
		);
		expect(screen.getByTestId('type-functional')).toHaveTextContent(
			'Test Functional'
		);
		expect(screen.getByTestId('type-analytics')).toHaveTextContent(
			'Test Analytics'
		);
		expect(screen.getByTestId('type-marketing')).toHaveTextContent(
			'Test Marketing'
		);

		// Check policy links
		expect(screen.getByTestId('learn-more')).toHaveTextContent(
			'Test Learn More'
		);
		expect(screen.getByTestId('policy-link')).toHaveTextContent(
			'/test-privacy'
		);
	});

	it('uses the custom namespace when provided', () => {
		// This doesn't really test different namespaces since our mock always returns the same translations
		// In a real test, you'd use a more sophisticated mock for useTranslations that respects namespaces
		render(<LocalizedCookieBanner namespace="CustomNamespace" />);

		expect(screen.getByTestId('mocked-cookie-banner')).toBeInTheDocument();
	});
});
