describe('User Management - UI Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Page Load', () => {
    it('should load the page successfully', () => {
      cy.contains('Testing Frameworks Demo').should('be.visible');
      cy.contains('User Management').should('be.visible');
      cy.contains('Users List').should('be.visible');
    });

    it('should display the user form', () => {
      cy.get('#userForm').should('be.visible');
      cy.get('#userName').should('be.visible');
      cy.get('#userEmail').should('be.visible');
      cy.get('#userAge').should('be.visible');
      cy.get('#submitBtn').should('contain', 'Add User');
    });

    it('should display initial users', () => {
      cy.waitForUsersList();
      cy.get('.user-card').should('have.length.at.least', 1);
    });
  });

  describe('Create User', () => {
    it('should create a new user with all fields', () => {
      cy.fillUserForm('Cypress Test User', 'cypress@example.com', 28);
      cy.get('#submitBtn').click();

      cy.get('#message').should('be.visible')
        .and('contain', 'created successfully')
        .and('have.class', 'success');

      cy.waitForUsersList();
      cy.contains('.user-card', 'Cypress Test User').should('be.visible');
      cy.contains('.user-card', 'cypress@example.com').should('be.visible');
    });

    it('should create a user without age', () => {
      cy.fillUserForm('No Age User', 'noage@example.com', '');
      cy.get('#submitBtn').click();

      cy.get('#message').should('be.visible')
        .and('contain', 'created successfully');

      cy.waitForUsersList();
      cy.contains('.user-card', 'No Age User').within(() => {
        cy.contains('Age: N/A').should('be.visible');
      });
    });

    it('should show validation error for missing name', () => {
      cy.get('#userEmail').type('test@example.com');
      cy.get('#submitBtn').click();

      // HTML5 validation should prevent submission
      cy.get('#userName:invalid').should('exist');
    });

    it('should show validation error for missing email', () => {
      cy.get('#userName').type('Test User');
      cy.get('#submitBtn').click();

      // HTML5 validation should prevent submission
      cy.get('#userEmail:invalid').should('exist');
    });

    it('should show error for duplicate email', () => {
      cy.fillUserForm('Duplicate User', 'john@example.com', 30);
      cy.get('#submitBtn').click();

      cy.get('#message').should('be.visible')
        .and('contain', 'Email already exists')
        .and('have.class', 'error');
    });

    it('should show error for invalid age', () => {
      cy.fillUserForm('Invalid Age User', 'invalid@example.com', 200);
      cy.get('#submitBtn').click();

      cy.get('#message').should('be.visible')
        .and('contain', 'Invalid age')
        .and('have.class', 'error');
    });
  });

  describe('Read Users', () => {
    it('should display all users in the list', () => {
      cy.waitForUsersList();
      cy.get('.user-card').should('have.length.at.least', 3);
      
      cy.get('.user-card').first().within(() => {
        cy.get('h3').should('be.visible');
        cy.contains('Email:').should('be.visible');
        cy.contains('Age:').should('be.visible');
      });
    });

    it('should refresh users list when clicking refresh button', () => {
      cy.waitForUsersList();
      const initialCount = Cypress.$('.user-card').length;

      // Add a new user via API
      cy.createUser({
        name: 'API User',
        email: 'api@example.com',
        age: 25
      });

      // Click refresh
      cy.get('#refreshBtn').click();

      cy.waitForUsersList();
      cy.get('.user-card').should('have.length', initialCount + 1);
      cy.contains('.user-card', 'API User').should('be.visible');
    });
  });

  describe('Update User', () => {
    it('should edit an existing user', () => {
      cy.waitForUsersList();
      
      // Click edit on first user
      cy.get('.user-card').first().within(() => {
        cy.get('.btn-edit').click();
      });

      // Form should be filled with user data
      cy.get('#userName').should('have.value', 'John Doe');
      cy.get('#userEmail').should('have.value', 'john@example.com');
      cy.get('#submitBtn').should('contain', 'Update User');
      cy.get('#cancelBtn').should('be.visible');

      // Update the user
      cy.get('#userName').clear().type('Updated John Doe');
      cy.get('#submitBtn').click();

      cy.get('#message').should('be.visible')
        .and('contain', 'updated successfully')
        .and('have.class', 'success');

      cy.waitForUsersList();
      cy.contains('.user-card', 'Updated John Doe').should('be.visible');
    });

    it('should cancel edit mode', () => {
      cy.waitForUsersList();
      
      cy.get('.user-card').first().within(() => {
        cy.get('.btn-edit').click();
      });

      cy.get('#submitBtn').should('contain', 'Update User');
      cy.get('#cancelBtn').should('be.visible');

      // Click cancel
      cy.get('#cancelBtn').click();

      // Form should reset
      cy.get('#userName').should('have.value', '');
      cy.get('#userEmail').should('have.value', '');
      cy.get('#userAge').should('have.value', '');
      cy.get('#submitBtn').should('contain', 'Add User');
      cy.get('#cancelBtn').should('not.be.visible');
    });
  });

  describe('Delete User', () => {
    it('should delete a user', () => {
      cy.waitForUsersList();
      
      // Get initial count
      cy.get('.user-card').then($cards => {
        const initialCount = $cards.length;

        // Stub the confirm dialog
        cy.window().then(win => {
          cy.stub(win, 'confirm').returns(true);
        });

        // Delete first user
        cy.get('.user-card').first().within(() => {
          cy.get('.btn-danger').click();
        });

        cy.get('#message').should('be.visible')
          .and('contain', 'deleted successfully')
          .and('have.class', 'success');

        cy.waitForUsersList();
        cy.get('.user-card').should('have.length', initialCount - 1);
      });
    });

    it('should not delete user if confirmation is cancelled', () => {
      cy.waitForUsersList();
      
      cy.get('.user-card').then($cards => {
        const initialCount = $cards.length;

        // Stub the confirm dialog to return false
        cy.window().then(win => {
          cy.stub(win, 'confirm').returns(false);
        });

        cy.get('.user-card').first().within(() => {
          cy.get('.btn-danger').click();
        });

        // User count should remain the same
        cy.get('.user-card').should('have.length', initialCount);
      });
    });
  });

  describe('Complete User Flow', () => {
    it('should complete CRUD operations', () => {
      // CREATE
      cy.fillUserForm('Flow Test User', 'flow@example.com', 35);
      cy.get('#submitBtn').click();
      cy.get('#message').should('contain', 'created successfully');

      cy.waitForUsersList();
      cy.contains('.user-card', 'Flow Test User').should('be.visible');

      // UPDATE
      cy.contains('.user-card', 'Flow Test User').within(() => {
        cy.get('.btn-edit').click();
      });

      cy.get('#userName').clear().type('Flow Test User Updated');
      cy.get('#userAge').clear().type('40');
      cy.get('#submitBtn').click();
      cy.get('#message').should('contain', 'updated successfully');

      cy.waitForUsersList();
      cy.contains('.user-card', 'Flow Test User Updated').should('be.visible');
      cy.contains('.user-card', 'Flow Test User Updated').within(() => {
        cy.contains('Age: 40').should('be.visible');
      });

      // DELETE
      cy.window().then(win => {
        cy.stub(win, 'confirm').returns(true);
      });

      cy.contains('.user-card', 'Flow Test User Updated').within(() => {
        cy.get('.btn-danger').click();
      });

      cy.get('#message').should('contain', 'deleted successfully');
      cy.waitForUsersList();
      cy.contains('.user-card', 'Flow Test User Updated').should('not.exist');
    });
  });

  describe('UI Responsiveness', () => {
    it('should be responsive on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      
      cy.get('#userForm').should('be.visible');
      cy.waitForUsersList();
      cy.get('.user-card').should('be.visible');
    });

    it('should be responsive on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/');
      
      cy.get('#userForm').should('be.visible');
      cy.waitForUsersList();
      cy.get('.user-card').should('be.visible');
    });
  });
});
