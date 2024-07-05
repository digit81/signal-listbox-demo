describe('navigation', () => {
  it('should navigate away from guarded routes after logout', () => {
    cy.setupMockUser();

    cy.visit('/edit');

    cy.get('[data-test=login-btn]').click();

    cy.url().should('eq', Cypress.config().baseUrl);
  });
});
