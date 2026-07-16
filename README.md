# Testing Frameworks Demo 🧪

A QA portfolio project showcasing **production-grade test automation patterns** used in enterprise SaaS applications.
Built with the stack used at companies like ParkChirp: TypeScript, Cypress, Jest, GraphQL, Qase, and GitHub Actions CI/CD.

## ✨ Features

| Area | Details |
|------|---------|
| **TypeScript** | All Cypress tests written in TypeScript with strict types |
| **Page Object Model** | `UserPage.ts` encapsulates all UI selectors and actions |
| **Cypress E2E** | Happy/unhappy path coverage, `cy.intercept()` for GraphQL |
| **Jest API Tests** | Integration tests covering CRUD, auth, and error states |
| **GraphQL Testing** | Query/mutation mocking, `cy.intercept` for GraphQL endpoints |
| **Jest Mock/Stub/Spy** | `jest.fn()`, `jest.spyOn()`, `mockResolvedValue`, `mockImplementation` |
| **Qase Integration** | Test management with automated reporting |
| **GitHub Actions** | CI pipelines for Cypress and Jest on every push |
| **HTML Reports** | Mochawesome (Cypress) + jest-html-reporter dashboards |

---

## 📁 Project Structure

```
testing-frameworks-demo/
├── app/                          # Express.js API + React-style UI
│   ├── routes/users.js           # REST API endpoints
│   └── server.js                 # Server entry point
│
├── cypress-tests/                # UI E2E Tests (Cypress + TypeScript)
│   ├── cypress/
│   │   ├── e2e/
│   │   │   ├── users.cy.js           # Original JS tests
│   │   │   └── users-pom.cy.ts       # TypeScript + Page Object Model ⭐
│   │   ├── pages/
│   │   │   └── UserPage.ts           # Page Object Model ⭐
│   │   └── support/
│   │       └── commands.js           # Custom Cypress commands
│   ├── tsconfig.json                 # TypeScript config
│   └── cypress.config.js
│
├── jest-tests/                   # API Integration Tests (Jest)
│   └── tests/
│       ├── api.test.js               # REST API tests
│       ├── graphql.test.js           # GraphQL query/mutation tests ⭐
│       └── jest-mocking.test.js      # Mock/stub/spy patterns ⭐
│
└── .github/workflows/            # CI/CD
    ├── cypress-tests.yml
    ├── jest-tests.yml
    └── qase-integration.yml
```

---

## 🧩 TypeScript + Page Object Model

```typescript
// cypress/pages/UserPage.ts
export class UserPage {
  private readonly nameInput = '#userName';

  visit(): this { cy.visit('/'); return this; }
  fillName(name: string): this { cy.get(this.nameInput).clear().type(name); return this; }
  submit(): this { cy.get('#submitBtn').click(); return this; }
}

// Usage in test
const page = new UserPage();
page.visit().fillName('Alice').fillEmail('alice@example.com').submit();
```

---

## 🔄 GraphQL Intercept (Cypress)

```typescript
// Spy on GraphQL requests
cy.intercept('POST', '**/graphql', (req) => {
  expect(req.body).to.have.property('query');
  req.continue();
}).as('gqlRequest');

// Stub GraphQL response
cy.intercept('POST', '**/graphql', {
  body: { data: { users: [{ id: '1', name: 'Mocked User' }] } }
}).as('mockedGraphQL');
```

---

## 🃏 Jest Mock / Stub / Spy

```javascript
jest.mock('axios');

// MOCK — replace axios with controlled return value
axios.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Alice' }] });
const users = await userService.getUsers();

// SPY — observe real implementation
const spy = jest.spyOn(service, 'validateEmail');
service.validateEmail('test@example.com');
expect(spy).toHaveBeenCalledWith('test@example.com');

// STUB — replace with custom implementation
jest.spyOn(service, 'createUser').mockImplementation(async (data) => ({
  id: 99, ...data, createdAt: new Date().toISOString()
}));
```

---

## 🚀 Quick Start

```bash
# Install & start the app
npm install && npm start

# Run Cypress tests (TypeScript + POM)
cd cypress-tests && npm install
npm run cy:run

# Run Jest tests (API + GraphQL + Mocking)
cd jest-tests && npm install
npm test

# Run with Qase reporting
cp .env.example .env  # add QASE_TOKEN
npm run cy:run:qase
npm run test:qase
```

---

## ⚙️ CI/CD — GitHub Actions

Every push triggers:
1. **Jest pipeline** — API tests + coverage report
2. **Cypress pipeline** — E2E tests + Mochawesome report + screenshots on failure
3. **Qase pipeline** — syncs results to Qase test management dashboard

---

## 🛠 Stack

`TypeScript` · `Cypress` · `Jest` · `GraphQL` · `Node.js` · `GitHub Actions` · `Qase` · `Page Object Model` · `Postman`

---

## 📊 Test Coverage Areas

| Coverage Type | Tool | Status |
|--------------|------|--------|
| UI E2E (happy path) | Cypress + TypeScript POM | ✅ |
| UI E2E (unhappy path) | Cypress | ✅ |
| GraphQL intercept | Cypress `cy.intercept()` | ✅ |
| API integration | Jest + axios | ✅ |
| GraphQL queries/mutations | Jest mocks | ✅ |
| Mock / Stub / Spy | Jest | ✅ |
| Flaky test patterns | Cypress best practices | ✅ |
| CI/CD pipeline | GitHub Actions | ✅ |
| Test management | Qase.io | ✅ |
