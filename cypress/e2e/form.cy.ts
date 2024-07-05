describe('form', () => {
  beforeEach(() => {
    cy.setupMockUser();

    cy.intercept('GET', '/vegetables', {fixture: 'veggies.json'}).as('getAll');

    cy.visit('/edit/1');

    cy.wait('@getAll');
  });

  it('should validate inputs and display error messages', () => {
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('form').should('include.text', 'Change any of the fields to save');

    cy.get('#name').clear();

    cy.get('form').should(
      'not.include.text',
      'Change any of the fields to save',
    );

    cy.get('#name').blur();
    cy.get('#name').next().should('include.text', 'Please provide a name');

    cy.get('#description').clear();

    cy.get('#description').blur();
    cy.get('#description')
      .next()
      .should('include.text', 'Please provide a description');

    cy.get('button[type=submit]').should('be.disabled');

    cy.fixture('new-veggie.json').then((veggie) => {
      cy.get('#name').type(veggie.name);
      cy.get('#description').type(veggie.description);

      cy.get('button[type=submit]').should('not.be.disabled');
    });
  });
});
