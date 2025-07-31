/// <reference types="cypress" />

describe('logOut', () => {

  beforeEach(() => cy.login());

  it('should log out', () => {
    cy.get('[data-cy=btn-logout]').click();
    cy.url().should('include', '/login');
  });
});
