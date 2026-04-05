import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: 'http://localhost:3001/api/v1',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
