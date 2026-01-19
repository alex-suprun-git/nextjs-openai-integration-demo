export type UsercentricsConsentEntry = {
	// Common fields seen in UC APIs / event payloads
	serviceId?: string;
	templateId?: string;
	id?: string;
	name?: string;
	label?: string;

	// Consent booleans vary by payload shape
	consent?: boolean;
	consented?: boolean;
	status?: boolean;
	value?: boolean;
};

export type UsercentricsConsents = UsercentricsConsentEntry[];

function isConsentTrue(entry: UsercentricsConsentEntry): boolean {
	return (
		entry.consent === true ||
		entry.consented === true ||
		entry.status === true ||
		entry.value === true
	);
}

export function normalizeUsercentricsConsents(
	value: unknown
): UsercentricsConsents | null {
	if (!value) return null;
	if (Array.isArray(value)) return value as UsercentricsConsents;
	if (typeof value !== 'object') return null;

	const obj = value as Record<string, unknown>;
	if (Array.isArray(obj.consents)) return obj.consents as UsercentricsConsents;
	if (Array.isArray(obj.services)) return obj.services as UsercentricsConsents;

	// Some UC window events provide booleans keyed by service name.
	const booleanKeys = Object.entries(obj).filter(
		([, v]) => typeof v === 'boolean'
	) as Array<[string, boolean]>;
	if (booleanKeys.length > 0) {
		return booleanKeys.map(([name, consent]) => ({ name, consent }));
	}

	return null;
}

function matchesService(
	entry: UsercentricsConsentEntry,
	{
		serviceId,
		serviceName,
	}: { serviceId?: string; serviceName?: string }
): boolean {
	const entryId = entry.serviceId ?? entry.templateId ?? entry.id;
	const entryName = entry.name ?? entry.label;

	if (serviceId && entryId) return entryId === serviceId;
	if (serviceName && entryName)
		return entryName.toLowerCase() === serviceName.toLowerCase();

	return false;
}

export function hasUsercentricsConsent(
	consents: UsercentricsConsents | null,
	{
		serviceId,
		serviceName,
	}: { serviceId?: string; serviceName?: string }
): boolean {
	if (!consents || consents.length === 0) return false;

	// We intentionally do NOT apply heuristics here; callers should be explicit.
	return consents.some((entry) => {
		if (!matchesService(entry, { serviceId, serviceName })) return false;
		return isConsentTrue(entry);
	});
}

type UsercentricsGlobal = {
	initPromise?: Promise<unknown>;
	getConsents?: () => Promise<unknown>;
};

function getUc(): UsercentricsGlobal | null {
	if (typeof window === 'undefined') return null;
	const win = window as Window & { UC_UI?: UsercentricsGlobal };
	return (win.UC_UI ?? null) as UsercentricsGlobal | null;
}

export async function readUsercentricsConsents({
	timeoutMs = 3000,
}: { timeoutMs?: number } = {}): Promise<UsercentricsConsents | null> {
	const uc = getUc();
	if (!uc || typeof uc.getConsents !== 'function') return null;

	// Wait for UC to initialize if possible; don't block forever.
	try {
		if (uc.initPromise && typeof uc.initPromise.then === 'function') {
			await Promise.race([
				uc.initPromise,
				new Promise((resolve) => setTimeout(resolve, timeoutMs)),
			]);
		}
	} catch {
		// Ignore init errors; we still might be able to read cached consent.
	}

	try {
		return normalizeUsercentricsConsents(await uc.getConsents());
	} catch {
		return null;
	}
}

export function subscribeToUsercentricsUpdates(
	{
		eventName = 'ucEvent',
		onUpdate,
	}: {
		eventName?: string;
		onUpdate: (detail: unknown) => void;
	},
	{
		alsoListenTo = ['UC_CONSENT', 'UC_UI_INITIALIZED'],
	}: { alsoListenTo?: string[] } = {}
): () => void {
	if (typeof window === 'undefined') return () => {};

	const handler = (e: Event) => onUpdate((e as CustomEvent).detail);
	const events = [eventName, ...alsoListenTo].filter(Boolean);
	for (const evt of events) window.addEventListener(evt, handler);

	return () => {
		for (const evt of events) window.removeEventListener(evt, handler);
	};
}

