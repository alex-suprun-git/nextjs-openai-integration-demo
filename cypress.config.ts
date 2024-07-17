import { clerkSetup } from '@clerk/testing/cypress';
import codeCoverageTask from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return clerkSetup({ config });
    },

    baseUrl: 'http://localhost:3000',
  },
});
