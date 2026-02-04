'use client';

import React from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import { useConsentManager } from '@c15t/react';

export interface AnalyticsManagerProps {
	/**
	 * Google Tag Manager ID
	 */
	gtmId: string;
}

/**
 * Analytics Manager component that renders Google Tag Manager.
 * Only loads GTM if user has consented to analytics.
 */
const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ gtmId }) => {
	const { has } = useConsentManager();
	const hasAnalyticsConsent = has('measurement');

	// Only render GTM if user has consented to measurement (analytics)
	if (!hasAnalyticsConsent) {
		return null;
	}

	return <GoogleTagManager gtmId={gtmId} />;
};

export default AnalyticsManager;
