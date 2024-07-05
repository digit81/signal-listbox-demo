/// <reference types="cypress" />

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    setupMockUser(): void;
  }
}

Cypress.Commands.add('setupMockUser', () => {
  cy.fixture('user')
    .then((user) => JSON.stringify(user))
    .then((userJson) => window.localStorage.setItem('user-token', userJson));
});
