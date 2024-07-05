describe('top bar', () => {
  it('presents a working login button', () => {
    cy.visit('/');

    cy.get('[data-test=login-btn]')
      .should('include.text', 'Log in')
      .click()
      .as('btn');

    cy.get('[data-test=greeting').should('include.text', 'Hi');

    cy.get('[data-test=toast]')
      .should('include.text', 'Logged in')
      .and('have.class', 'success');
  });

  it('presents a working logout button', () => {
    cy.setupMockUser();

    cy.visit('/');

    cy.get('[data-test=login-btn]').should('include.text', 'Log out').click();

    cy.get('[data-test=greeting').should('not.exist');

    cy.get('[data-test=toast]')
      .should('include.text', 'Logged out')
      .and('have.class', 'success');
  });
});
