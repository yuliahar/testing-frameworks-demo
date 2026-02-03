const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-qase-reporter',
    cypressQaseReporterReporterOptions: {
      mode: process.env.QASE_MODE || 'off',
      debug: process.env.QASE_DEBUG === 'true',
      testops: {
        api: {
          token: process.env.QASE_TESTOPS_API_TOKEN,
        },
        project: process.env.QASE_TESTOPS_PROJECT,
        uploadAttachments: true,
        run: {
          title: process.env.QASE_TESTOPS_RUN_TITLE || 'Cypress UI Tests - Automated Run',
          description: process.env.QASE_TESTOPS_RUN_DESCRIPTION || 'Automated UI/E2E tests',
          complete: process.env.QASE_TESTOPS_RUN_COMPLETE === 'true',
        },
      },
      framework: {
        cypress: {
          screenshotsFolder: 'cypress/screenshots',
        },
      },
    },
  },
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    setupNodeEvents(on, config) {
      // Qase reporter plugin and metadata for v2.x
      require('cypress-qase-reporter/plugin')(on, config);
      require('cypress-qase-reporter/metadata')(on);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
