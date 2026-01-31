import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Disable instrumentation in Lambda environment to avoid module resolution issues
  // Sentry will still work via the error boundary and manual captures
  if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.log('Skipping Sentry instrumentation in Lambda environment');
    return;
  }

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
