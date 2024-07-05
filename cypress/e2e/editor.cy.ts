describe('vegetable editor', () => {
  beforeEach(() => {
    cy.setupMockUser();

    cy.intercept('GET', '/vegetables', {fixture: 'veggies.json'}).as('getAll');

    cy.intercept('POST', '/vegetables/*', {fixture: 'new-veggie.json'});

    cy.intercept('PUT', '/vegetables/*', {fixture: 'edited-veggie.json'});

    cy.intercept('DELETE', '/vegetables/*', {statusCode: 200});

    cy.visit('/edit');

    cy.wait('@getAll');
  });

  it('should display a list of retrieved veggies', () => {
    cy.get('[data-test=editor-item]').should('have.length', 3);
  });

  it('should remove the deleted veggie', () => {
    cy.contains('[data-test=editor-item]', 'Carrot')
      .as('carrot')
      .find('[data-test=delete-btn]')
      .click();

    cy.get('@carrot').should('not.exist');
  });

  it('should present a working button to add a new veggie', () => {
    cy.get('[data-test=addnew-btn]').click();

    cy.url().should('include', '/create');

    cy.contains('Create new vegetable');

    cy.get('#name').should('not.have.value');
  });

  it('should present a working button to edit a veggie', () => {
    cy.contains('[data-test=editor-item]', 'Carrot')
      .find('[data-test=edit-btn]')
      .click();

    cy.url().should('include', '/edit/1');

    cy.contains('Edit vegetable');

    cy.get('#name').should('have.value', 'Carrot');
  });

  it('should add the newly created veggie', () => {
    cy.visit('/create');

    cy.fixture('new-veggie.json').then((veggie) => {
      cy.get('#name').type(veggie.name);
      cy.get('#description').type(veggie.description);
      cy.get('button[type=submit]').as('btn').click();
    });

    cy.url().should('match', /edit/);

    cy.get('[data-test=editor-item]')
      .should('have.length', 4)
      .and('include.text', 'Cucumber');
  });

  it('should update the edited veggie', () => {
    cy.visit('/edit/3');

    cy.fixture('edited-veggie.json').then((veggie) => {
      cy.get('#name').clear().type(veggie.name);
      cy.get('#description').clear().type(veggie.description);
      cy.get('button[type=submit]').as('btn').click();

      cy.get('[data-test=back-btn]').click();

      cy.contains('[data-test=editor-item]', 'Tomato').should('not.exist');
      cy.contains('[data-test=editor-item]', veggie.name).should(
        'include.text',
        veggie.description,
      );
    });
  });
});
