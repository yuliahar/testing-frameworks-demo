/**
 * Page Object Model — User Management Page
 * Encapsulates all UI interactions for the User Management section.
 * Keeps tests clean and selectors in one place.
 */
export class UserPage {
  // Selectors
  private readonly nameInput = '#userName';
  private readonly emailInput = '#userEmail';
  private readonly ageInput = '#userAge';
  private readonly submitBtn = '#submitBtn';
  private readonly messageEl = '#message';
  private readonly usersList = '#usersList';
  private readonly userCard = '.user-card';

  visit(): this {
    cy.visit('/');
    return this;
  }

  fillName(name: string): this {
    cy.get(this.nameInput).clear().type(name);
    return this;
  }

  fillEmail(email: string): this {
    cy.get(this.emailInput).clear().type(email);
    return this;
  }

  fillAge(age: number): this {
    cy.get(this.ageInput).clear().type(age.toString());
    return this;
  }

  submit(): this {
    cy.get(this.submitBtn).click();
    return this;
  }

  getMessage(): Cypress.Chainable {
    return cy.get(this.messageEl);
  }

  getUserCards(): Cypress.Chainable {
    return cy.get(this.userCard);
  }

  findUserByName(name: string): Cypress.Chainable {
    return cy.contains(this.userCard, name);
  }

  waitForList(): this {
    cy.get(this.usersList).should('not.contain', 'Loading users...');
    return this;
  }
}
