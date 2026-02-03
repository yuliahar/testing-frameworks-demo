# Quick Start Guide 🚀

Get up and running with the Testing Frameworks Demo in 5 minutes!

## Prerequisites

- Node.js (v18.x or v20.x)
- npm (v9.x or later)

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh
```

This will:
- Install all dependencies
- Create necessary directories
- Verify the installation
- Test server startup

### Option 2: Manual Setup

```bash
# Install all dependencies at once
npm run install:all

# Or install separately
npm install                          # Main app
cd jest-tests && npm install        # Jest tests
cd ../cypress-tests && npm install  # Cypress tests
```

## Running the Application

### 1. Start the Server

```bash
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

### 2. Run Tests

Open a new terminal and run:

**API Tests (Jest):**
```bash
npm run test:jest
```

**UI Tests (Cypress - Headless):**
```bash
npm run test:cypress
```

**UI Tests (Cypress - Interactive):**
```bash
npm run test:cypress:open
```

**All Tests:**
```bash
npm run test:all
```

## Viewing Reports

After running tests, view the generated reports:

### Jest Reports
```bash
# Open HTML report
open jest-tests/reports/test-report.html

# Open coverage report
open jest-tests/coverage/lcov-report/index.html
```

### Cypress Reports
```bash
# Open Mochawesome report
open cypress-tests/cypress/reports/index.html

# Videos are in: cypress-tests/cypress/videos/
# Screenshots are in: cypress-tests/cypress/screenshots/
```

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","age":30}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","age":35}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Using Browser

Simply open http://localhost:3000 and use the UI to:
- View all users
- Create new users
- Edit existing users
- Delete users

## Project Structure (Simplified)

```
testing-frameworks-demo/
├── app/                    # Application code
│   ├── server.js          # Express server
│   ├── routes/users.js    # User API endpoints
│   └── public/            # Frontend files
├── jest-tests/            # API integration tests
│   └── tests/api.test.js
├── cypress-tests/         # UI E2E tests
│   └── cypress/e2e/users.cy.js
└── .github/workflows/     # CI/CD workflows
```

## Common Commands

```bash
# Development
npm run dev              # Start with auto-reload

# Testing
npm run test:jest        # Run API tests
npm run test:cypress     # Run UI tests (headless)
npm run test:cypress:open # Run UI tests (interactive)
npm run test:all         # Run all tests

# Installation
npm run install:all      # Install all dependencies
```

## Troubleshooting

### Port 3000 is already in use

```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Tests can't connect to server

Make sure the server is running in another terminal:
```bash
npm start
```

### Cypress won't open

Try clearing the cache:
```bash
cd cypress-tests
npx cypress cache clear
npm install
```

## Next Steps

1. ✅ Application running
2. ✅ Tests passing
3. 📚 Read the full [README.md](./README.md)
4. 🔧 Customize for your needs
5. 🚀 Set up CI/CD with GitHub Actions
6. 📊 Explore QA dashboards in [qa-dashboard/](./qa-dashboard/)

## Getting Help

- 📖 [Full Documentation](./README.md)
- 🧪 [Jest Tests Guide](./jest-tests/README.md)
- 🌲 [Cypress Tests Guide](./cypress-tests/README.md)
- 📊 [QA Dashboard Guide](./qa-dashboard/README.md)

---

**Ready to test!** 🎉
