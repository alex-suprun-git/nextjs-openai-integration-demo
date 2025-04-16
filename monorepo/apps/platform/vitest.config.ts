import { defineConfig, defaultExclude, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: [...defaultExclude, 'middleware.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'middlewares/**/*.ts',
        'middleware.ts',
        'next.config.js',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'utils/db.ts',
        'app/loading.tsx',
        'commitlint.config.cjs',
        'app/api/user-limits-renewal/route.ts',
        'i18n.ts',
      ],
    },
  },
});
