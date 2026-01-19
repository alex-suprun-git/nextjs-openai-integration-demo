import { useEffect, useMemo, useState } from 'react';

import {
	hasUsercentricsConsent,
	normalizeUsercentricsConsents,
	readUsercentricsConsents,
	subscribeToUsercentricsUpdates,
	type UsercentricsConsents,
} from './usercentrics';

export function useUsercentricsConsent({
	serviceId,
	serviceName,
	eventName = 'ucEvent',
	timeoutMs = 3000,
}: {
	serviceId?: string;
	serviceName?: string;
	eventName?: string;
	timeoutMs?: number;
}): boolean {
	const isConfigured = useMemo(
		() => Boolean(serviceId || serviceName),
		[serviceId, serviceName]
	);
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		let cancelled = false;

		// Safety: with explicit-only matching, we don't enable anything by accident.
		if (!isConfigured) {
			setEnabled(false);
			return;
		}

		const evaluate = (consents: UsercentricsConsents | null) => {
			const nextEnabled = hasUsercentricsConsent(consents, {
				serviceId,
				serviceName,
			});
			if (!cancelled) setEnabled(nextEnabled);
		};

		const refreshFromApi = async () => {
			const consents = await readUsercentricsConsents({ timeoutMs });
			evaluate(consents);
		};

		void refreshFromApi();

		const unsubscribe = subscribeToUsercentricsUpdates({
			eventName,
			onUpdate: (detail) => {
				const fromEvent = normalizeUsercentricsConsents(detail);
				if (fromEvent) {
					// Some UC event payloads only contain booleans keyed by (localized) service name.
					// If we're configured by ID only, we can't reliably match those entries -> refresh from API.
					const hasAnyIdFields = fromEvent.some(
						(e) => Boolean(e.serviceId || e.templateId || e.id)
					);

					if (serviceId && !serviceName && !hasAnyIdFields) {
						void refreshFromApi();
						return;
					}

					evaluate(fromEvent);
					// Even if we can evaluate from event, re-check via API to cover partial payloads.
					void refreshFromApi();
					return;
				}
				void refreshFromApi();
			},
		});

		return () => {
			cancelled = true;
			unsubscribe();
		};
	}, [eventName, isConfigured, serviceId, serviceName, timeoutMs]);

	return enabled;
}

