'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { GoogleTagManager } from '@next/third-parties/google';

export interface AnalyticsManagerProps {
	/**
	 * Google Tag Manager ID
	 */
	gtmId: string;

	/**
	 * Cookie name to check for consent status
	 * @default "gdpr-consent"
	 */
	cookieName?: string;

	/**
	 * Value in the cookie that indicates consent was given
	 * @default "accepted"
	 */
	acceptedValue?: string;
}

/**
 * Analytics Manager component that conditionally renders Google Tag Manager
 * based on the user's cookie consent status.
 */
const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({
	gtmId,
	cookieName = 'gdpr-consent',
	acceptedValue = 'accepted',
}) => {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		// Check consent status from cookies
		const consent = Cookies.get(cookieName);

		// Enable analytics only if consent is explicitly accepted
		setEnabled(consent === acceptedValue);

		// Disable Google Analytics if consent is not given
		if (consent !== acceptedValue && typeof window !== 'undefined') {
			// Disable GA for all measurement IDs
			// This is a fallback in case GTM has already loaded
			window[`ga-disable-${gtmId}`] = true;
		}
	}, [cookieName, acceptedValue, gtmId]);

	// Don't render GTM if consent not given
	if (!enabled) return null;

	return <GoogleTagManager gtmId={gtmId} />;
};

export default AnalyticsManager;
