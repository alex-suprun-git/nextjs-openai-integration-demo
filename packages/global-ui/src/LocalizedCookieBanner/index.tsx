'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import CookieBanner from '../CookieBanner';

export interface LocalizedCookieBannerProps {
	namespace?: string;
}

/**
 * A GDPR cookie banner component with next-intl localization support.
 * Uses the same namespace across all monorepo applications.
 */
const LocalizedCookieBanner: React.FC<LocalizedCookieBannerProps> = ({
	namespace = 'CookieBanner',
}) => {
	const t = useTranslations(namespace);

	const translations = {
		title: t('title'),
		description: t('description'),
		acceptButton: t('acceptButton'),
		rejectButton: t('rejectButton'),
		types: {
			required: t('types.required'),
			functional: t('types.functional'),
			analytics: t('types.analytics'),
			marketing: t('types.marketing'),
		},
		learnMore: t('learnMore'),
		policyLink: t('policyLink'),
	};

	return <CookieBanner translations={translations} />;
};

export default LocalizedCookieBanner;
