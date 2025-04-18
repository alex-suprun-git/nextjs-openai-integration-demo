import {
	defineConfig,
	defaultExclude,
	coverageConfigDefaults,
} from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './config/setupTests.tsx',
		exclude: [...defaultExclude],
		coverage: {
			reporter: ['text', 'json', 'html'],
			exclude: [
				...coverageConfigDefaults.exclude,
				'apps/**/middlewares/**/*.ts',
				'apps/**/middleware.ts',
				'apps/**/next.config.js',
				'apps/**/postcss.config.mjs',
				'apps/**/tailwind.config.ts',
				'apps/**/utils/db.ts',
				'apps/**/app/loading.tsx',
				'apps/**/commitlint.config.cjs',
				'apps/**/i18n.ts',
			],
		},
	},
});
