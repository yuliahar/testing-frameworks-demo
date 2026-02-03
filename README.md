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
- **QA Dashboards**: Multiple reporting options (Allure, Mochawesome, JUnit)
- **Test Management**: Integration ready for Qase.io, TestRail, and more
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
│       └── allure-report.yml    # Allure report generation
│
├── qa-dashboard/                # QA Reporting configs
│   ├── README.md                # Dashboard documentation
│   ├── qase-jest.config.json   # Qase integration (Jest)
│   ├── qase-cypress.config.json # Qase integration (Cypress)
│   └── custom-integrations.md  # Advanced integrations
│
├── package.json                 # Root package.json
└── README.md                    # This file
```

## 🔧 Prerequisites

- **Node.js**: v18.x or v20.x
- **npm**: v9.x or later
- **Git**: For version control
- **Optional**: Allure CLI for local report generation

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
4. **GitHub Pages**: Access Allure reports (main branch)
   - URL: `https://<username>.github.io/<repo>/allure-reports/<run-number>/`

## 📊 QA Reporting & Dashboards

### Built-in Reports

#### 1. Allure Reports

- **Description**: Beautiful, comprehensive test reports
- **Features**: Historical trends, screenshots, logs, categorization
- **Access**: Generated in CI/CD, viewable on GitHub Pages
- **Local Setup**:

  ```bash
  # Install Allure CLI
  brew install allure  # macOS

  # Generate report
  allure generate ./allure-results -o ./allure-report --clean

  # Open report
  allure open ./allure-report
  ```

#### 2. Mochawesome (Cypress)

- **Description**: Rich HTML reports for Cypress tests
- **Location**: `cypress-tests/cypress/reports/`
- **Features**: Screenshots, test duration, pass/fail rates

#### 3. Jest HTML Reporter

- **Description**: Detailed HTML reports for Jest tests
- **Location**: `jest-tests/reports/test-report.html`
- **Features**: Coverage, test details, console logs

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

#### Custom Dashboards

- Grafana for real-time metrics
- ElasticSearch + Kibana for log analysis
- ReportPortal for AI-powered insights
- Custom Express-based dashboard

**Full guide**: See `qa-dashboard/custom-integrations.md`

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

### Test Writing Guidelines

**Jest Tests:**

```javascript
describe("Feature", () => {
	beforeEach(async () => {
		await api.post("/users/reset");
	});

	test("should test something", async () => {
		const response = await api.get("/endpoint");
		expect(response.status).toBe(200);
	});
});
```

**Cypress Tests:**

```javascript
describe("Feature", () => {
	beforeEach(() => {
		cy.visit("/");
	});

	it("should test something", () => {
		cy.get("#element").should("be.visible");
		cy.get("#element").click();
	});
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test:all`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Tests failing locally:**

```bash
# Ensure server is running
npm start

# In another terminal, run tests
npm run test:jest
```

**Cypress can't connect:**

```bash
# Check server is running
curl http://localhost:3000/api/health

# Check baseUrl in cypress.config.js
```

## 📝 License

ISC

## 👥 Authors

Created as a comprehensive testing frameworks demonstration.

---

## 🎯 Next Steps

1. **Set up GitHub repository** (if not already done)
2. **Configure GitHub Pages** for Allure reports
3. **Add GitHub secrets** for optional integrations (Qase, TestRail, etc.)
4. **Customize workflows** to match your needs
5. **Explore custom dashboards** in `qa-dashboard/custom-integrations.md`
6. **Integrate with your test management platform**
