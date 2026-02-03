# Jest API Integration Tests

This folder contains Jest-based integration tests for the API endpoints.

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Test Reports

Test reports are generated in the `reports/` directory:
- `test-report.html` - HTML test report
- `junit.xml` - JUnit format for CI/CD integration

## Test Structure

```
jest-tests/
├── tests/
│   └── api.test.js      # API integration tests
├── reports/             # Test reports (generated)
├── coverage/            # Coverage reports (generated)
├── package.json
└── README.md
```

## Environment Variables

- `API_URL` - Base URL for the API (default: http://localhost:3000/api)

## Test Coverage

The tests cover:
- Health check endpoint
- GET operations (list all, get by ID)
- POST operations (create user, validations)
- PUT operations (update user, validations)
- DELETE operations (delete user)
- Complete CRUD integration flow
- Error handling and edge cases
