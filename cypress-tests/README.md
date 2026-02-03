# Cypress UI Tests

This folder contains Cypress-based end-to-end UI tests for the application.

## Setup

```bash
npm install
```

## Running Tests

```bash
# Open Cypress Test Runner (interactive mode)
npm run cy:open

# Run tests in headless mode
npm run cy:run

# Run tests with Chrome
npm run cy:run:chrome

# Run tests with Firefox
npm run cy:run:firefox

# Run tests in headed mode (see browser)
npm run cy:run:headed

# Run tests in CI mode
npm run cy:run:ci
```

## Test Reports

Test reports are generated in the `cypress/reports/` directory:
- HTML reports with screenshots and videos
- JSON reports for CI/CD integration

Videos and screenshots are saved in:
- `cypress/videos/` - Test execution videos
- `cypress/screenshots/` - Failure screenshots

## Test Structure

```
cypress-tests/
├── cypress/
│   ├── e2e/
│   │   └── users.cy.js       # UI tests for user management
│   ├── support/
│   │   ├── commands.js        # Custom Cypress commands
│   │   └── e2e.js            # Global configuration
│   ├── videos/                # Test videos (generated)
│   ├── screenshots/           # Test screenshots (generated)
│   └── reports/               # Test reports (generated)
├── cypress.config.js
├── package.json
└── README.md
```

## Custom Commands

Custom commands are defined in `cypress/support/commands.js`:
- `cy.createUser(userData)` - Create a user via API
- `cy.deleteUser(userId)` - Delete a user via API
- `cy.getUsers()` - Get all users via API
- `cy.resetUsers()` - Reset users to initial state
- `cy.fillUserForm(name, email, age)` - Fill the user form
- `cy.waitForUsersList()` - Wait for users list to load

## Test Coverage

The tests cover:
- Page load and initial state
- Create user (with validations)
- Read/display users
- Update user
- Delete user
- Complete CRUD flow
- UI responsiveness (mobile, tablet, desktop)
- Error handling
- Form validations
