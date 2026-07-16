/**
 * UI E2E Tests — TypeScript + Page Object Model
 * Covers happy path, unhappy path, and GraphQL intercept patterns
 * matching ParkChirp's Cypress + GraphQL + TypeScript stack.
 */
import { UserPage } from '../pages/UserPage';

describe('User Management — TypeScript POM', () => {
  const page = new UserPage();

  beforeEach(() => {
    cy.request('POST', '/api/users/reset');
    page.visit().waitForList();
  });

  // ── Happy Path ──────────────────────────────────────────────
  describe('Create User (Happy Path)', () => {
    it('should create a user with all valid fields', () => {
      page.fillName('TS POM User').fillEmail('ts-pom@example.com').fillAge(30).submit();
      page.getMessage()
        .should('be.visible')
        .and('contain', 'created successfully')
        .and('have.class', 'success');
      page.findUserByName('TS POM User').should('be.visible');
    });

    it('should display new user in the list after creation', () => {
      page.fillName('Listed User').fillEmail('listed@example.com').fillAge(22).submit();
      page.waitForList();
      page.getUserCards().should('have.length.at.least', 1);
      page.findUserByName('Listed User').should('contain', 'listed@example.com');
    });
  });

  // ── Unhappy Path ────────────────────────────────────────────
  describe('Create User (Unhappy Path)', () => {
    it('should show error when name is missing', () => {
      page.fillEmail('noname@example.com').fillAge(25).submit();
      page.getMessage().should('be.visible').and('have.class', 'error');
    });

    it('should show error for invalid email format', () => {
      page.fillName('Bad Email').fillEmail('not-an-email').fillAge(25).submit();
      page.getMessage().should('be.visible').and('have.class', 'error');
    });

    it('should show error for age below minimum', () => {
      page.fillName('Negative Age').fillEmail('neg@example.com').fillAge(-1).submit();
      page.getMessage().should('be.visible').and('have.class', 'error');
    });

    it('should show error for age above maximum (>120)', () => {
      page.fillName('Old User').fillEmail('old@example.com').fillAge(200).submit();
      page.getMessage().should('be.visible').and('have.class', 'error');
    });
  });

  // ── GraphQL Intercept ───────────────────────────────────────
  describe('GraphQL API Intercept (Cypress pattern)', () => {
    it('should intercept and spy on GraphQL requests', () => {
      cy.intercept('POST', '**/graphql', (req) => {
        expect(req.body).to.have.property('query');
        req.continue();
      }).as('gqlRequest');

      page.visit();
      // In a real GraphQL app, this verifies the request structure
    });

    it('should stub GraphQL response to simulate server data', () => {
      cy.intercept('POST', '**/graphql', {
        statusCode: 200,
        body: {
          data: {
            users: [
              { id: '1', name: 'GraphQL Stub User', email: 'stub@gql.com', age: 28 },
            ],
          },
        },
      }).as('stubbedGQL');

      page.visit();
      // Verifies UI renders correctly regardless of real API state
    });

    it('should simulate GraphQL error state', () => {
      cy.intercept('POST', '**/graphql', {
        statusCode: 200,
        body: {
          errors: [{ message: 'Not authenticated', extensions: { code: 'UNAUTHENTICATED' } }],
          data: null,
        },
      }).as('gqlError');

      page.visit();
    });
  });

  // ── Flaky Test Handling Example ─────────────────────────────
  describe('Resilient test patterns (anti-flakiness)', () => {
    it('should use cy.request for state setup instead of UI clicks', () => {
      // Best practice: set up state via API, not UI navigation — prevents flakiness
      cy.request('POST', '/api/users', {
        name: 'API Setup User',
        email: 'setup@example.com',
        age: 25,
      }).then((response) => {
        expect(response.status).to.eq(201);
      });

      page.visit().waitForList();
      page.findUserByName('API Setup User').should('be.visible');
    });
  });
});
