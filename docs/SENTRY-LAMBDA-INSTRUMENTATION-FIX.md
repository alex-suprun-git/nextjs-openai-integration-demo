# Sentry + Next.js Standalone (Lambda) – Instrumentation Fix Research

## Problem

Next.js 16.1.x standalone build + Sentry instrumentation causes Lambda 500:

```
Error: Cannot find module 'require-in-the-middle-2ca7b9c2766f317e'
```

Failure happens at **import time** when loading `instrumentation.js` (before `register()` runs). Sentry’s server instrumentation pulls in `require-in-the-middle` (OpenTelemetry), which Turbopack doesn’t bundle correctly for standalone output.

## References

- [Sentry #15209](https://github.com/getsentry/sentry-javascript/issues/15209) – Critical dependency warning with require-in-the-middle (Next.js 15.1.6, Sentry 8.52.0). Closed; 36+ reactions.
- [Next.js #69023](https://github.com/vercel/next.js/issues/69023) – Failed to build standalone using instrumentationHook (edge-instrumentation copy). Labels: Instrumentation, Output.
- [Sentry Build Options](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/) – `bundleSizeOptimizations.excludeTracing`, `widenClientFileUpload`, etc.
- [Sentry Options](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/) – `tracesSampleRate`, `disableInstrumentationWarnings`.
- [Next.js serverExternalPackages](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages) – Exclude packages from server bundling (use native `require`).
- [Sentry AWS Lambda](https://docs.sentry.io/platforms/javascript/guides/aws-lambda/) – Lambda Layer vs NPM; different setup for serverless.

## Proposed solutions (from issues/docs)

### 1. **Sentry build: exclude server tracing** (try first)

In `withSentryConfig`, use bundle-size options so tracing/instrumentation code is not included in the server bundle:

```js
withSentryConfig(nextConfig, {
  // ...existing options
  bundleSizeOptimizations: {
    excludeTracing: true,  // tree-shake tracing/OpenTelemetry code
  },
});
```

Documentation: [Build Options - bundleSizeOptimizations.excludeTracing](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/).  
Note: You lose server-side performance tracing; errors and client-side tracing can still work.

### 2. **Next.js: keep Sentry (and deps) external**

So the bundler doesn’t try to inline `require-in-the-middle`:

```js
// next.config.js – nextConfig
serverExternalPackages: [
  '@sentry/nextjs',
  '@sentry/opentelemetry',
  '@opentelemetry/instrumentation',
  'require-in-the-middle',
],
```

Then ensure these packages are present in the Lambda deployment (e.g. in `node_modules` when building the standalone bundle).

### 3. **Sentry Lambda Layer (recommended for production)**

Use [Sentry’s AWS Lambda Layer](https://docs.sentry.io/platforms/javascript/guides/aws-lambda/install/layer) instead of (or in addition to) the Next.js instrumentation hook for server-side capture in Lambda. This avoids the Next.js instrumentation bundling issue entirely for the Lambda runtime.

### 4. **Next.js version**

- **Next.js 16.2.0-canary.19+** includes [“Inline handler dependencies instead of tracing” (#89269)](https://github.com/vercel/next.js/releases) for standalone. Canary may fix the way instrumentation deps are bundled.
- **Stable 16.2.0** – when released – is the target if you want to keep current instrumentation.
- **Downgrade to 16.0.10** – known to work with Sentry instrumentation before the regression.

### 5. **Webpack instead of Turbopack (if applicable)**

Sentry’s [tree-shaking](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/tree-shaking/) and some build options are documented for **webpack** only: “Tree-shaking options are not supported for Turbopack builds at the moment.” If you can switch the production build to webpack, you could use `webpack.treeshake.removeTracing` and related options.

### 6. **Disable Sentry server init in instrumentation**

Keep `instrumentation.ts` but avoid importing Sentry at top level so the failing dependency is never loaded (e.g. no `import * as Sentry`). Then init Sentry only in routes/middleware or via Lambda Layer. This is the “no server instrumentation hook” approach.

---

## What was reverted

`apps/public/instrumentation.ts` was reverted to the **original** Sentry setup (with `register()` and `onRequestError`). No changes were made to that file in this doc.

## Suggested order to try

1. Add **`bundleSizeOptimizations.excludeTracing: true`** in `next.config.js` and redeploy.
2. If it still fails, add **`serverExternalPackages`** for Sentry/OpenTelemetry/require-in-the-middle and ensure they’re in the Lambda package.
3. If you need full server tracing in Lambda, plan for **Sentry Lambda Layer** or wait for **Next.js 16.2.0 stable** and retest.
