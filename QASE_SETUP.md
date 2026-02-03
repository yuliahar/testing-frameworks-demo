# Qase.io Integration Setup Guide 🎯

Complete guide to set up Qase.io test management integration with your testing framework.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Qase.io Account Setup](#qaseio-account-setup)
- [Local Development Setup](#local-development-setup)
- [Adding Test Case IDs](#adding-test-case-ids)
- [GitHub Actions Integration](#github-actions-integration)
- [Running Tests with Qase](#running-tests-with-qase)
- [Viewing Results](#viewing-results)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Active Qase.io account ([Sign up for free](https://app.qase.io/signup))
- Node.js and npm installed
- Project dependencies installed (`npm run install:all`)

## Qase.io Account Setup

### 1. Create Qase.io Account

1. Go to [https://app.qase.io/signup](https://app.qase.io/signup)
2. Sign up for a free account
3. Verify your email

### 2. Create a Project

1. Log in to Qase.io
2. Click "Create new project"
3. Fill in project details:
   - **Project name**: Testing Frameworks Demo
   - **Project code**: `TFD` (or your preferred code)
   - **Description**: Demo project for API and UI testing
4. Click "Create project"

### 3. Get API Token

1. Click on your profile (top right)
2. Go to "API tokens"
3. Click "Generate new token"
4. Name it: `GitHub Actions CI/CD`
5. Copy the token (you won't see it again!)

### 4. Note Your Project Code

Your project code is in the URL: `https://app.qase.io/project/YOUR_CODE`

Example: If URL is `https://app.qase.io/project/TFD`, your code is `TFD`

## Local Development Setup

### 1. Install Dependencies

```bash
# Install Jest dependencies with Qase reporter
cd jest-tests
npm install

# Install Cypress dependencies with Qase reporter
cd ../cypress-tests
npm install
```

### 2. Configure Environment Variables

**For Jest tests:**

```bash
cd jest-tests
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
QASE_API_TOKEN=your_actual_token_here
QASE_PROJECT_CODE=TFD
QASE_MODE=testops
```

**For Cypress tests:**

```bash
cd cypress-tests
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
QASE_API_TOKEN=your_actual_token_here
QASE_PROJECT_CODE=TFD
QASE_MODE=testops
```

### 3. Test Configuration

The Qase reporters are already configured! Check these files:

- Jest: `jest-tests/jest-qase.config.js`
- Cypress: `cypress-tests/cypress-qase.config.js`

## Adding Test Case IDs

To link automated tests to Qase test cases, add Qase IDs to your tests.

### Method 1: Create Test Cases in Qase First

1. **In Qase.io Dashboard:**

   - Go to your project
   - Click "Repository" → "Create test case"
   - Fill in test details
   - Note the test case ID (e.g., `TFD-1`)

2. **Add ID to Jest test:**

```javascript
describe("Users API - GET Operations", () => {
	test("GET /api/users should return all users", async () => {
		// Add Qase ID in test name
		// qaseId(1) or just add comment
		const response = await api.get("/users");
		expect(response.status).toBe(200);
	});
});
```

3. **Add ID to Cypress test:**

```javascript
it("should load the page successfully", function () {
	// Add Qase ID using custom field
	this.qaseId = 1; // or use qase(1) helper
	cy.contains("Testing Frameworks Demo").should("be.visible");
});
```

### Method 2: Auto-create Test Cases

Set `QASE_MODE=testops` and Qase will automatically create test cases from your tests.

## GitHub Actions Integration

### 1. Add GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions → New repository secret:

**Add these secrets:**

- Name: `QASE_API_TOKEN`, Value: `your_token_here`
- Name: `QASE_PROJECT_CODE`, Value: `TFD` (or your code)

### 2. Update Workflows

Create `.github/workflows/qase-integration.yml`:

```yaml
name: Qase Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  jest-qase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20.x"

      - name: Install dependencies
        run: |
          npm install
          cd jest-tests && npm install

      - name: Start API Server
        run: |
          npm start &
          sleep 5

      - name: Run Jest tests with Qase
        working-directory: ./jest-tests
        run: npm run test:qase
        env:
          QASE_API_TOKEN: ${{ secrets.QASE_API_TOKEN }}
          QASE_PROJECT_CODE: ${{ secrets.QASE_PROJECT_CODE }}
          QASE_MODE: testops
          QASE_RUN_NAME: "Jest API Tests - Run #${{ github.run_number }}"
          API_URL: http://localhost:3000/api

  cypress-qase:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20.x"

      - name: Install dependencies
        run: |
          npm install
          cd cypress-tests && npm install

      - name: Start API Server
        run: |
          npm start &
          sleep 5

      - name: Run Cypress tests with Qase
        working-directory: ./cypress-tests
        run: npm run cy:run:qase
        env:
          QASE_API_TOKEN: ${{ secrets.QASE_API_TOKEN }}
          QASE_PROJECT_CODE: ${{ secrets.QASE_PROJECT_CODE }}
          QASE_MODE: testops
          QASE_RUN_NAME: "Cypress UI Tests - Run #${{ github.run_number }}"
          CYPRESS_BASE_URL: http://localhost:3000
```

### 3. Update Existing Workflows

You can also add Qase environment variables to existing workflows (`jest-tests.yml`, `cypress-tests.yml`):

```yaml
env:
  QASE_API_TOKEN: ${{ secrets.QASE_API_TOKEN }}
  QASE_PROJECT_CODE: ${{ secrets.QASE_PROJECT_CODE }}
  QASE_MODE: testops
```

## Running Tests with Qase

### Local Execution

**Jest with Qase:**

```bash
cd jest-tests

# Using environment variables from .env
npm run test:qase

# Or set inline
QASE_MODE=testops QASE_API_TOKEN=your_token npm run test:qase
```

**Cypress with Qase:**

```bash
cd cypress-tests

# Using environment variables from .env
npm run cy:run:qase

# Or set inline
QASE_MODE=testops QASE_API_TOKEN=your_token npm run cy:run:qase
```

### CI/CD Execution

Push your code or create a PR, and GitHub Actions will automatically:

1. Run tests
2. Report results to Qase.io
3. Create/update test runs

## Viewing Results

### In Qase.io Dashboard

1. Go to [https://app.qase.io](https://app.qase.io)
2. Select your project
3. Click "Test runs" in the sidebar
4. You'll see your automated test runs with results

**Test Run includes:**

- Total tests executed
- Pass/fail counts
- Test duration
- Detailed results for each test
- Stack traces for failures
- Screenshots (Cypress)

### Rich Features

- 📊 **Dashboard**: Overview of test metrics
- 📈 **Trends**: Track test stability over time
- 🔍 **Defects**: Link test failures to defects
- 📋 **Test Cases**: Maintain test case repository
- 🎯 **Test Plans**: Group tests into plans
- 🔄 **Integrations**: Connect to Jira and other tools

## Advanced Configuration

### Custom Run Configuration

Edit `jest-tests/jest-qase.config.js` or `cypress-tests/cypress-qase.config.js`:

```javascript
{
  mode: 'testops',
  testops: {
    run: {
      title: 'Custom Run Title',
      description: 'Custom description',
      complete: true, // Auto-complete run
      environment: 1, // Environment ID
      milestone: 1,   // Milestone ID
    },
    plan: {
      id: 1 // Link to test plan
    },
    batch: {
      size: 100 // Batch size for results
    }
  }
}
```

### Environment-Specific Runs

Create separate configs for different environments:

```bash
# Development
QASE_MODE=testops \
QASE_RUN_NAME="Dev Tests" \
QASE_ENVIRONMENT_ID=1 \
npm run test:qase

# Staging
QASE_MODE=testops \
QASE_RUN_NAME="Staging Tests" \
QASE_ENVIRONMENT_ID=2 \
npm run test:qase

# Production
QASE_MODE=testops \
QASE_RUN_NAME="Production Tests" \
QASE_ENVIRONMENT_ID=3 \
npm run test:qase
```

### Qase Test Case Annotations

**In Jest:**

```javascript
describe("API Tests", () => {
	test("should create user", async () => {
		// Will be auto-mapped to Qase
		const response = await api.post("/users", userData);
		expect(response.status).toBe(201);
	});
});
```

**In Cypress:**

```javascript
describe("UI Tests", () => {
	it("should create user via UI", () => {
		cy.fillUserForm("Test", "test@example.com", 25);
		cy.get("#submitBtn").click();
		cy.contains("created successfully").should("be.visible");
	});
});
```

## Troubleshooting

### Issue: Tests run but don't appear in Qase

**Solution:**

1. Check `QASE_MODE=testops` is set
2. Verify API token is correct
3. Confirm project code matches
4. Check network connectivity to api.qase.io
5. Enable debug: `QASE_DEBUG=true`

### Issue: Authentication Error

**Solution:**

```bash
# Verify token works
curl -H "Token: YOUR_TOKEN" https://api.qase.io/v1/project

# Should return list of projects
```

### Issue: Project not found

**Solution:**

- Double-check project code (case-sensitive)
- Ensure you have access to the project
- Try creating a new project

### Issue: Tests creating duplicate test cases

**Solution:**

- Use consistent test names
- Set `complete: true` to auto-complete runs
- Use explicit test case IDs

### Debug Mode

Enable verbose logging:

```bash
# Jest
QASE_DEBUG=true npm run test:qase

# Cypress
QASE_DEBUG=true npm run cy:run:qase
```

Check console output for detailed information.

### Common Error Messages

**"Invalid API token"**

- Token is incorrect or expired
- Generate new token in Qase settings

**"Project not found"**

- Wrong project code
- No access to project

**"Rate limit exceeded"**

- Too many requests
- Wait a few minutes and retry

## Best Practices

1. **Use Descriptive Test Names**: Helps with auto-mapping
2. **Group Related Tests**: Use describe blocks
3. **Complete Runs Automatically**: Set `complete: true`
4. **Link to Requirements**: Add links in test case descriptions
5. **Use Environments**: Track different testing environments
6. **Review Regularly**: Check Qase dashboard weekly
7. **Clean Up**: Archive old test runs periodically

## Qase.io Features

### Available in Free Tier

- ✅ Unlimited test cases
- ✅ 3 users
- ✅ Basic integrations
- ✅ Test runs
- ✅ Basic reporting

### Premium Features

- 🔒 Unlimited users
- 🔒 Advanced integrations (Jira, etc.)
- 🔒 Custom fields
- 🔒 SSO
- 🔒 Priority support

## Additional Resources

- **Qase Docs**: https://help.qase.io/
- **API Reference**: https://developers.qase.io/
- **Jest Reporter**: https://github.com/qase-tms/qase-javascript/tree/main/qase-jest
- **Cypress Reporter**: https://github.com/qase-tms/qase-javascript/tree/main/qase-cypress
- **Support**: support@qase.io

## Quick Reference

```bash
# Environment Variables
QASE_API_TOKEN=your_token
QASE_PROJECT_CODE=TFD
QASE_MODE=testops  # or 'off'

# Run with Qase
npm run test:qase           # Jest
npm run cy:run:qase         # Cypress

# Debug
QASE_DEBUG=true npm run test:qase
```

---

**Your Qase.io integration is ready!** 🎉

All tests will now automatically report results to your Qase.io dashboard, providing comprehensive test management and reporting capabilities.
