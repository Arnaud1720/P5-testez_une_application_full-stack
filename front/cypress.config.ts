import {defineConfig} from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts').default(on, config);
    }
  },
  video: false,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  fixturesFolder: 'cypress/fixtures'
});
