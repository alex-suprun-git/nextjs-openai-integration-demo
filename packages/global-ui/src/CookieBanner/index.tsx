'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export interface CookieBannerProps {
	translations: {
		title: string;
		description: string;
		acceptButton: string;
		rejectButton: string;
		types?: {
			required?: string;
			functional?: string;
			analytics?: string;
			marketing?: string;
		};
		learnMore?: string;
		policyLink?: string;
	};
	cookieName?: string;
	cookieExpires?: number;
	onReject?: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({
	translations,
	cookieName = 'gdpr-consent',
	cookieExpires = 365, // days - set to 1 year for better UX
	onReject,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Check for existing consent cookie when component loads
		const hasConsent = Cookies.get(cookieName);

		// Only show banner if no consent cookie exists
		if (!hasConsent) {
			setIsVisible(true);
		}
	}, [cookieName]);

	const handleAccept = () => {
		// Save consent in cookies with proper domain handling
		const cookieOptions = {
			expires: cookieExpires,
			secure: window.location.protocol === 'https:',
			sameSite: 'strict' as const,
		};

		// Try to set cookie for the current domain
		try {
			Cookies.set(cookieName, 'accepted', cookieOptions);
		} catch (error) {
			// Fallback: try without domain restrictions
			Cookies.set(cookieName, 'accepted', { expires: cookieExpires });
		}

		setIsVisible(false);
	};

	const handleReject = () => {
		// Save rejection in cookies with proper domain handling
		const cookieOptions = {
			expires: cookieExpires,
			secure: window.location.protocol === 'https:',
			sameSite: 'strict' as const,
		};

		// Try to set cookie for the current domain
		try {
			Cookies.set(cookieName, 'rejected', cookieOptions);
		} catch (error) {
			// Fallback: try without domain restrictions
			Cookies.set(cookieName, 'rejected', { expires: cookieExpires });
		}

		setIsVisible(false);

		// Call the onReject callback if provided
		if (onReject) {
			onReject();
		}

		// Redirect to Google homepage
		window.location.href = 'https://www.google.com';
	};

	if (!isVisible) return null;

	const cookieTypes = [];
	if (translations.types?.required)
		cookieTypes.push(translations.types.required);
	if (translations.types?.functional)
		cookieTypes.push(translations.types.functional);
	if (translations.types?.analytics)
		cookieTypes.push(translations.types.analytics);
	if (translations.types?.marketing)
		cookieTypes.push(translations.types.marketing);

	const hasTypes = cookieTypes.length > 0;

	return (
		<>
			{/* Full-screen overlay to block all interactions */}
			<div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-auto" />

			{/* Cookie banner positioned above the overlay */}
			<div className="fixed border-t-1 border-black bottom-0 left-0 right-0 z-50 p-4 bg-gray-900 shadow-lg">
				<div className="container mx-auto">
					<div className="flex flex-col sm:flex-row items-start justify-between gap-4">
						<div className="max-w-2xl">
							<h2 className="text-lg mb-2 font-semibold">
								{translations.title}
							</h2>
							<p className="text-sm">{translations.description}</p>

							{hasTypes && (
								<p className="mt-1 mb-1 text-xs text-slate-400">
									{cookieTypes.join(' • ')}
								</p>
							)}

							{translations.learnMore && translations.policyLink && (
								<a
									href="#"
									className="mt-1 inline-block text-yellow-200 hover:underline text-xs">
									{translations.learnMore}
								</a>
							)}
						</div>
						<div className="flex gap-2 self-end">
							<button
								onClick={handleReject}
								className="btn bg-red-800 hover:bg-red-900 btn-sm">
								{translations.rejectButton}
							</button>
							<button
								onClick={handleAccept}
								className="btn bg-yellow-200 hover:bg-yellow-300 text-black btn-sm">
								{translations.acceptButton}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CookieBanner;
