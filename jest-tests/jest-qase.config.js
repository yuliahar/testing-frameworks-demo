module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'tests/**/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  testTimeout: 10000,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'API Integration Test Report',
        outputPath: 'reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        dateFormat: 'yyyy-mm-dd HH:MM:ss'
      }
    ],
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true
      }
    ],
    [
      'jest-qase-reporter',
      {
        mode: process.env.QASE_MODE || 'off',
        debug: process.env.QASE_DEBUG === 'true' || false,
        testops: {
          api: {
            token: process.env.QASE_API_TOKEN
          },
          project: process.env.QASE_PROJECT_CODE,
          run: {
            title: process.env.QASE_RUN_NAME || 'Jest API Tests - Automated Run',
            description: process.env.QASE_RUN_DESCRIPTION || 'Automated API integration tests',
            complete: true
          }
        }
      }
    ]
  ]
};
