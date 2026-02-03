// Custom commands for Cypress tests

/**
 * Create a user via API
 */
Cypress.Commands.add('createUser', (userData) => {
  return cy.request({
    method: 'POST',
    url: '/api/users',
    body: userData,
    failOnStatusCode: false
  });
});

/**
 * Delete a user via API
 */
Cypress.Commands.add('deleteUser', (userId) => {
  return cy.request({
    method: 'DELETE',
    url: `/api/users/${userId}`,
    failOnStatusCode: false
  });
});

/**
 * Get all users via API
 */
Cypress.Commands.add('getUsers', () => {
  return cy.request('GET', '/api/users');
});

/**
 * Reset users to initial state
 */
Cypress.Commands.add('resetUsers', () => {
  return cy.request('POST', '/api/users/reset');
});

/**
 * Fill user form
 */
Cypress.Commands.add('fillUserForm', (name, email, age) => {
  if (name) cy.get('#userName').clear().type(name);
  if (email) cy.get('#userEmail').clear().type(email);
  if (age) cy.get('#userAge').clear().type(age.toString());
});

/**
 * Wait for users list to load
 */
Cypress.Commands.add('waitForUsersList', () => {
  cy.get('#usersList').should('not.contain', 'Loading users...');
  cy.get('#usersList .user-card, #usersList .loading').should('exist');
});
