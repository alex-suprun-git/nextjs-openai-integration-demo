import { Environment } from './types';

export function getCurrentEnv(options: { host?: string } = {}): Environment {
	if (typeof window !== 'undefined') {
		const host = window.location.hostname;
		if (host === 'localhost' || host.endsWith('.local')) {
			return Environment.DEV;
		}
		return Environment.PROD;
	}

	if (options.host) {
		const host = options.host.split(':')[0];
		if (host === 'localhost' || host === '127.0.0.1') {
			return Environment.DEV;
		}
		return Environment.PROD;
	}

	return process.env.NODE_ENV === Environment.PROD
		? Environment.PROD
		: Environment.DEV;
}
