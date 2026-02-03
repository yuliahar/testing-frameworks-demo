const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    reporter: 'cypress-qase-reporter',
    reporterOptions: {
      mode: process.env.QASE_MODE || 'off',
      debug: process.env.QASE_DEBUG === 'true' || false,
      testops: {
        api: {
          token: process.env.QASE_API_TOKEN
        },
        project: process.env.QASE_PROJECT_CODE,
        run: {
          title: process.env.QASE_RUN_NAME || 'Cypress UI Tests - Automated Run',
          description: process.env.QASE_RUN_DESCRIPTION || 'Automated UI/E2E tests',
          complete: true
        },
        uploadAttachments: true
      }
    },
    setupNodeEvents(on, config) {
      // Qase reporter plugin and metadata
      require('cypress-qase-reporter/plugin')(on, config);
      require('cypress-qase-reporter/metadata')(on);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
});
