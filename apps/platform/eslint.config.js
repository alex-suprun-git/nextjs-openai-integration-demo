import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: ['node_modules/', '.next/', 'dist/', 'coverage/', '.turbo/'],
  },
];
