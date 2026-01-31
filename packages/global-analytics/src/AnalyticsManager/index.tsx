'use client';

import React from 'react';
import { GoogleTagManager } from '@next/third-parties/google';

export interface AnalyticsManagerProps {
	/**
	 * Google Tag Manager ID
	 */
	gtmId: string;
}

/**
 * Analytics Manager component that renders Google Tag Manager.
 */
const AnalyticsManager: React.FC<AnalyticsManagerProps> = ({ gtmId }) => {
	return <GoogleTagManager gtmId={gtmId} />;
};

export default AnalyticsManager;
