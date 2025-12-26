const http = require('http');
const { spawn } = require('child_process');

let serverProcess = null;
let serverReady = false;
const SERVER_PORT = 3000;

// Start Next.js standalone server
async function startNextServer() {
	return new Promise((resolve, reject) => {
		console.log('Starting Next.js server...');

		serverProcess = spawn('node', ['server.js'], {
			cwd: __dirname,
			env: {
				...process.env,
				PORT: SERVER_PORT,
				HOSTNAME: 'localhost',
				NODE_ENV: 'production',
			},
			stdio: ['ignore', 'pipe', 'pipe'],
		});

		serverProcess.stdout.on('data', (data) => {
			console.log('Server stdout:', data.toString());
			if (
				data.toString().includes('Ready') ||
				data.toString().includes('started')
			) {
				serverReady = true;
				resolve();
			}
		});

		serverProcess.stderr.on('data', (data) => {
			console.error('Server stderr:', data.toString());
		});

		serverProcess.on('error', (error) => {
			console.error('Failed to start server:', error);
			reject(error);
		});

		// Timeout fallback - assume ready after 5 seconds
		setTimeout(() => {
			if (!serverReady) {
				console.log('Server timeout reached, assuming ready');
				serverReady = true;
				resolve();
			}
		}, 5000);
	});
}

// Make HTTP request to localhost Next.js server
async function proxyRequest(path, method, headers, body) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: 'localhost',
			port: SERVER_PORT,
			path: path,
			method: method,
			headers: headers,
		};

		const req = http.request(options, (res) => {
			const chunks = [];

			res.on('data', (chunk) => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const buffer = Buffer.concat(chunks);
				resolve({
					statusCode: res.statusCode,
					headers: res.headers,
					body: buffer.toString('utf8'),
				});
			});
		});

		req.on('error', (error) => {
			reject(error);
		});

		if (body) {
			req.write(body);
		}

		req.end();
	});
}

// Main Lambda handler
exports.handler = async (event, context) => {
	console.log('Event:', JSON.stringify(event, null, 2));

	try {
		// Ensure Next.js server is running
		if (!serverReady) {
			await startNextServer();
		}

		// Parse request details
		const path = event.rawPath || event.path || '/';
		const method = event.requestContext?.http?.method || 'GET';
		const headers = event.headers || {};
		const body = event.body || '';

		console.log(`Proxying ${method} ${path} to localhost:${SERVER_PORT}`);

		// Proxy request to Next.js server
		const response = await proxyRequest(path, method, headers, body);

		// Normalize headers for API Gateway
		const normalizedHeaders = {};
		for (const [key, value] of Object.entries(response.headers)) {
			// Capitalize first letter of each word
			const normalized = key
				.split('-')
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
				)
				.join('-');
			normalizedHeaders[normalized] = value;
		}

		// Remove headers that cause issues with API Gateway/CloudFront
		const problematicHeaders = [
			'Transfer-Encoding',
			'Connection',
			'Keep-Alive',
			'Upgrade',
			'Trailer',
			'Te',
		];

		const cleanHeaders = {};
		const cookies = [];

		for (const [key, value] of Object.entries(normalizedHeaders)) {
			if (!problematicHeaders.includes(key)) {
				// Handle Set-Cookie specially for API Gateway v2
				if (key.toLowerCase() === 'set-cookie') {
					// Convert to array if not already
					if (Array.isArray(value)) {
						cookies.push(...value);
					} else {
						cookies.push(value);
					}
				} else {
					cleanHeaders[key] = value;
				}
			}
		}

		const lambdaResponse = {
			statusCode: response.statusCode,
			headers: cleanHeaders,
			body: response.body || '',
			isBase64Encoded: false,
		};

		// Add cookies if present
		if (cookies.length > 0) {
			lambdaResponse.cookies = cookies;
		}

		return lambdaResponse;
	} catch (error) {
		console.error('Handler error:', error);
		return {
			statusCode: 500,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				error: error.message,
				stack: error.stack,
			}),
		};
	}
};
