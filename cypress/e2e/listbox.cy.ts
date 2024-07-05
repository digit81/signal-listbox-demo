describe('veggie listbox', () => {
  beforeEach(() => cy.visit('/'));

  it('displays a single details card of the selected item', () => {
    cy.get('[data-test=option-name]:first').as('option').click();

    cy.get('@option')
      .invoke('text')
      .then((veggieName) => {
        cy.get('[data-test=card-title]')
          .as('veggie-card')
          .should('have.text', veggieName);
      });

    cy.get('[data-test=selection-heading]')
      .as('heading')
      .should('include.text', '1 item');

    cy.get('@option').click();

    cy.get('@veggie-card').should('not.exist');

    cy.get('@heading').should('include.text', '0 items');
  });

  it('indicates when an option is selected', () => {
    cy.get('jm-option:first').click().contains('✓');
  });
});
