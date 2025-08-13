/// <reference types="cypress" />

describe('logOut', () => {

  beforeEach(() => cy.login());

  it('should log out', () => {
    cy.get('[data-cy=btn-logout]')
      .should('exist')
      .should('be.visible')
      .click();

    // On attend que l'URL change pour bien vérifier la redirection
    cy.url().should('include', '/login');
  });
});
///TODO  -> 401 click on logout -> redirect to my profil
