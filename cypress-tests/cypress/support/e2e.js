// Import commands
import './commands';

// Import mochawesome reporter
import 'cypress-mochawesome-reporter/register';

// Hide fetch/XHR requests in command log (optional)
const app = window.top;

if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Global before hook
beforeEach(() => {
  // Reset users before each test
  cy.request('POST', 'http://localhost:3000/api/users/reset');
});
