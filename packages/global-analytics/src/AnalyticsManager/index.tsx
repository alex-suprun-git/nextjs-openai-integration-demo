'use client';

import React from 'react';
import { GoogleTagManager } from '@next/third-parties/google';

import { useUsercentricsConsent } from './useUsercentricsConsent';

export interface AnalyticsManagerProps {
	/**
	 * Google Tag Manager ID
	 */
	gtmId: string;

	/**
	 * Usercentrics service/template ID to check for consent.
	 *
	 * Prefer this over `usercentricsServiceName` because names can be localized/renamed.
	 */
	usercentricsServiceId?: string;

	/**
	 * Optional Usercentrics service name to check for consent.
	 * Use only if you can't provide `usercentricsServiceId`.
	 */
	usercentricsServiceName?: string;

	/**
	 * Usercentrics "Window Event Name" (configured in the UC admin UI).
	 * @default "ucEvent"
	 */
	usercentricsEventName?: string;

	/**
	 * Max time (ms) to wait for Usercentrics init before reading consent.
	 * @default 3000
	 */
	usercentricsTimeoutMs?: number;
}

/**
 * Analytics Manager component that conditionally renders Google Tag Manager
 * based on the user's Usercentrics consent status.
 */
const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({
	gtmId,
	usercentricsServiceId,
	usercentricsServiceName,
	usercentricsEventName = 'ucEvent',
	usercentricsTimeoutMs = 3000,
}) => {
	const enabled = useUsercentricsConsent({
		serviceId: usercentricsServiceId,
		serviceName: usercentricsServiceName,
		eventName: usercentricsEventName,
		timeoutMs: usercentricsTimeoutMs,
	});

	// Don't render GTM if consent not given
	if (!enabled) return null;

	return <GoogleTagManager gtmId={gtmId} />;
};

export default AnalyticsManager;
