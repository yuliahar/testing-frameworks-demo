# Testing Frameworks Demo 🧪

A comprehensive demonstration project showcasing modern testing practices with API and UI testing, CI/CD integration, and advanced QA reporting dashboards.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [CI/CD](#cicd)
- [QA Reporting & Dashboards](#qa-reporting--dashboards)
- [Architecture](#architecture)
- [Documentation](#documentation)

## ✨ Features

- **Full-Stack Application**: Express.js API + Modern UI
- **API Integration Tests**: Jest-based API testing with comprehensive coverage
- **UI E2E Tests**: Cypress-based end-to-end testing
- **CI/CD Pipeline**: GitHub Actions workflows with automated testing
- **QA Dashboards**: Multiple reporting options (Mochawesome, JUnit, Qase.io)
- **Test Management**: Integration with Qase.io test management platform
- **Beautiful Reports**: HTML reports with screenshots, videos, and metrics
- **Code Coverage**: Automated coverage tracking and reporting

## 📁 Project Structure

```
testing-frameworks-demo/
├── app/                          # Main application
│   ├── routes/                   # API routes
│   │   └── users.js             # User management endpoints
│   ├── public/                   # Frontend files
│   │   ├── index.html           # Main UI
│   │   ├── styles.css           # Styling
│   │   └── app.js               # Frontend JavaScript
│   └── server.js                # Express server
│
├── jest-tests/                   # API Integration Tests
│   ├── tests/
│   │   └── api.test.js          # API test suite
│   ├── reports/                  # Test reports (generated)
│   ├── coverage/                 # Coverage reports (generated)
│   ├── package.json
│   └── README.md
│
├── cypress-tests/                # UI E2E Tests
│   ├── cypress/
│   │   ├── e2e/
│   │   │   └── users.cy.js      # UI test suite
│   │   ├── support/
│   │   │   ├── commands.js      # Custom commands
│   │   │   └── e2e.js          # Global config
│   │   ├── videos/              # Test videos (generated)
│   │   ├── screenshots/         # Screenshots (generated)
│   │   └── reports/             # Test reports (generated)
│   ├── cypress.config.js
│   ├── package.json
│   └── README.md
│
├── .github/
│   └── workflows/               # CI/CD workflows
│       ├── jest-tests.yml       # Jest test automation
│       ├── cypress-tests.yml    # Cypress test automation
│       ├── full-test-suite.yml  # Complete test suite
│       └── qase-integration.yml # Qase.io integration
│
├── qa-dashboard/                # QA Reporting configs
│   ├── README.md                # Dashboard documentation
│   ├── qase-jest.config.json   # Qase integration (Jest)
│   └── qase-cypress.config.json # Qase integration (Cypress)
│
├── package.json                 # Root package.json
└── README.md                    # This file
```

## 🔧 Prerequisites

- **Node.js**: v23.11.1 or later
- **npm**: v10.x or later
- **Git**: For version control

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd testing-frameworks-demo

# Install all dependencies (app + test suites)
npm run install:all

# Or install separately
npm install                      # Main app
cd jest-tests && npm install    # Jest tests
cd ../cypress-tests && npm install  # Cypress tests
```

### 2. Start the Application

```bash
# Start the server
npm start

# Or in development mode (with auto-reload)
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

### 3. Verify Installation

```bash
# Check API health
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-01T00:00:00.000Z"}
```

## 🧪 Testing

### API Integration Tests (Jest)

```bash
# Run Jest tests
npm run test:jest

# Or from jest-tests directory
cd jest-tests

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# CI mode
npm run test:ci
```

**Test Reports Location:**

- HTML: `jest-tests/reports/test-report.html`
- JUnit: `jest-tests/reports/junit.xml`
- Coverage: `jest-tests/coverage/lcov-report/index.html`

### UI E2E Tests (Cypress)

```bash
# Run Cypress tests
npm run test:cypress

# Or from cypress-tests directory
cd cypress-tests

# Interactive mode (Test Runner)
npm run cy:open

# Headless mode
npm run cy:run

# Specific browser
npm run cy:run:chrome
npm run cy:run:firefox

# CI mode
npm run cy:run:ci
```

**Test Reports Location:**

- Reports: `cypress-tests/cypress/reports/`
- Videos: `cypress-tests/cypress/videos/`
- Screenshots: `cypress-tests/cypress/screenshots/`

### Run All Tests

```bash
# Run both Jest and Cypress tests
npm run test:all
```

### Run Tests with Qase.io Reporting

```bash
# Jest with Qase
cd jest-tests
npm run test:qase

# Cypress with Qase
cd cypress-tests
npm run cy:run:qase
```

**Setup Qase.io**: See [QASE_SETUP.md](./QASE_SETUP.md) for complete instructions.

## 🔄 CI/CD

### GitHub Actions Workflows

The project includes 4 automated workflows:

#### 1. Jest API Tests (`jest-tests.yml`)

- Runs on: Push, Pull Request, Manual trigger
- Tests on: Node 18.x and 20.x
- Features:
  - Automated test execution
  - Test result reporting
  - PR comments with results
  - Artifact uploads

#### 2. Cypress UI Tests (`cypress-tests.yml`)

- Runs on: Push, Pull Request, Manual trigger
- Tests on: Chrome and Firefox
- Features:
  - Multi-browser testing
  - Video/screenshot capture
  - Test result dashboards
  - PR comments with results

#### 3. Full Test Suite (`full-test-suite.yml`)

- Runs on: Push to main, Pull Request, Daily schedule, Manual trigger
- Features:
  - Complete test execution
  - Combined reporting
  - Comprehensive summaries
  - Notification system

### Triggering Workflows Manually

```bash
# Via GitHub CLI
gh workflow run "Full Test Suite"
gh workflow run "Jest API Tests"
gh workflow run "Cypress UI Tests"
```

Or use the "Actions" tab in GitHub and click "Run workflow".

### Viewing Results

1. **GitHub Actions Tab**: See workflow runs and summaries
2. **Pull Request Comments**: Automated test result comments
3. **Artifacts**: Download detailed reports and videos
4. **Qase.io Dashboard**: View comprehensive test results and analytics

## 📊 QA Reporting & Dashboards

### Built-in Reports

#### 1. Jest HTML Reporter

- **Description**: Detailed HTML reports for Jest tests
- **Location**: `jest-tests/reports/test-report.html`
- **Features**: Coverage, test details, console logs

#### 2. Mochawesome (Cypress)

- **Description**: Rich HTML reports for Cypress tests
- **Location**: `cypress-tests/cypress/reports/`
- **Features**: Screenshots, test duration, pass/fail rates

#### 3. Qase.io Reports

- **Description**: Comprehensive test management platform
- **Location**: https://app.qase.io
- **Features**: Test runs, analytics, trends, team collaboration

### Optional Integrations

The project is ready for integration with:

#### Qase.io ✅ **FULLY INTEGRATED**

Test management platform with test case management and reporting.

- **Status**: Fully configured and ready to use!
- **Quick Start**: [QASE_QUICKSTART.md](./QASE_QUICKSTART.md) - 5-minute setup
- **Complete Guide**: [QASE_SETUP.md](./QASE_SETUP.md) - Detailed instructions
- **Setup Script**: `./setup-qase.sh` - Automated setup
- **Configuration**:
  - Jest: `jest-tests/jest-qase.config.js`
  - Cypress: `cypress-tests/cypress-qase.config.js`
- **GitHub Workflow**: `.github/workflows/qase-integration.yml`
- **Commands**:
  - `npm run test:qase` (Jest)
  - `npm run cy:run:qase` (Cypress)

## 🏗️ Architecture

### API Endpoints

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/api/health`      | Health check          |
| GET    | `/api/users`       | Get all users         |
| GET    | `/api/users/:id`   | Get user by ID        |
| POST   | `/api/users`       | Create new user       |
| PUT    | `/api/users/:id`   | Update user           |
| DELETE | `/api/users/:id`   | Delete user           |
| POST   | `/api/users/reset` | Reset to initial data |

### Test Coverage

**API Tests (Jest):**

- ✅ Health check endpoint
- ✅ GET operations (list, get by ID, 404 handling)
- ✅ POST operations (create, validations, duplicates)
- ✅ PUT operations (update, validations, conflicts)
- ✅ DELETE operations (delete, 404 handling)
- ✅ Complete CRUD integration flow
- ✅ Error handling and edge cases

**UI Tests (Cypress):**

- ✅ Page load and initial state
- ✅ User form display and functionality
- ✅ Create user (with all validations)
- ✅ Display user list with refresh
- ✅ Edit user flow
- ✅ Delete user with confirmation
- ✅ Complete CRUD flow
- ✅ Responsive design (mobile, tablet, desktop)

## 📚 Documentation

### Additional Resources

- [Jest Tests README](./jest-tests/README.md)
- [Cypress Tests README](./cypress-tests/README.md)
- [QA Dashboard Guide](./qa-dashboard/README.md)
- [Custom Integrations](./qa-dashboard/custom-integrations.md)
