// Instrumentation disabled to avoid Sentry dependency bundling issues in Lambda
// with Next.js 16.1.x standalone builds. Sentry still works via error boundaries
// and manual captures in the application code.
//
// See: https://github.com/vercel/next.js/issues/69023
// See: https://github.com/getsentry/sentry-javascript/issues/15209

export async function register() {
  console.log('Instrumentation hook disabled for Lambda compatibility');
}
