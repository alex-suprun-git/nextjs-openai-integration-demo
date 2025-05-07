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
	cookieExpires = 7, // days
	onReject,
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Check for existing consent cookie when component loads
		const hasConsent = Cookies.get(cookieName);
		setIsVisible(!hasConsent);
	}, [cookieName]);

	const handleAccept = () => {
		// Save consent in cookies
		Cookies.set(cookieName, 'accepted', {
			expires: cookieExpires,
			domain: '.nextjs-ai-platform.site',
		});
		setIsVisible(false);
	};

	const handleReject = () => {
		// Save rejection in cookies instead of redirecting
		Cookies.set(cookieName, 'rejected', {
			expires: cookieExpires,
			domain: '.nextjs-ai-platform.site',
		});
		setIsVisible(false);

		// Call the onReject callback if provided
		if (onReject) {
			onReject();
		}
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
		<div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-base-200 shadow-lg">
			<div className="container mx-auto">
				<div className="flex flex-col sm:flex-row items-start justify-between gap-4">
					<div className="max-w-2xl">
						<h2 className="text-lg mb-2 font-semibold">{translations.title}</h2>
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
