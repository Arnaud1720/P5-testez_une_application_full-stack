import { defineConfig } from 'cypress'

const pool = require('./db');
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      on('task', {
        queryDb({ sql, values }) {
          return pool.execute(sql, values).then(([rows]) => rows);
        },
        cleanTable({ table }) {
          return pool.execute(`DELETE FROM ${table}`);
        }
      });
      return config;
    }
  },
  video: false,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  fixturesFolder: 'cypress/fixtures'
})
