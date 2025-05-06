'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export interface CookieBannerProps {
	translations: {
		title: string;
		description: string;
		acceptButton: string;
		rejectButton: string;
	};
	cookieName?: string;
	cookieExpires?: number;
}

const CookieBanner: React.FC<CookieBannerProps> = ({
	translations,
	cookieName = 'gdpr-consent',
	cookieExpires = 7, // days
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Check for existing consent cookie when component loads
		const hasConsent = Cookies.get(cookieName);
		setIsVisible(!hasConsent);
	}, [cookieName]);

	const handleAccept = () => {
		// Save consent in cookies
		Cookies.set(cookieName, 'accepted', { expires: cookieExpires });
		setIsVisible(false);
	};

	const handleReject = () => {
		// Redirect to Google when rejected
		window.location.href = 'https://www.google.com';
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-base-200 shadow-lg">
			<div className="container mx-auto">
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div>
						<h2 className="text-lg font-semibold">{translations.title}</h2>
						<p className="text-sm">{translations.description}</p>
					</div>
					<div className="flex gap-2">
						<button
							onClick={handleReject}
							className="btn btn-outline hover:text-black hover:bg-white btn-sm">
							{translations.rejectButton}
						</button>
						<button
							onClick={handleAccept}
							className="btn bg-yellow-200 text-black btn-sm hover:bg-yellow-300">
							{translations.acceptButton}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CookieBanner;
