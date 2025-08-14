/// <reference types="cypress" />

// Hypothèse : tu as déjà un helper cy.login() qui fait l'auth via l’UI
describe('Logout (simple)', () => {
  beforeEach(() => {
    cy.login(); // -> arrive sur /sessions
    cy.get('mat-toolbar', { timeout: 10000 }).should('be.visible');
  });

  it('clique sur Logout et affiche un header "déconnecté"', () => {
    // Pas besoin de data-cy: on cible le texte "Logout"
    cy.contains('mat-toolbar .link', 'Logout', { matchCase: false })
      .should('be.visible')
      .click();

    // Ton code navigue vers '' => on accepte '/' ou '/login'
    cy.location('pathname').should((p) => {
      expect(['/','/login']).to.include(p);
    });

    // Header public attendu
    cy.get('mat-toolbar').within(() => {
      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
      cy.contains('Logout').should('not.exist');
      cy.contains('Account').should('not.exist');
    });
  });

  it("après logout, l'accès à une page protégée renvoie vers une page publique", () => {
    cy.contains('mat-toolbar .link', 'Logout', { matchCase: false }).click();

    // Tente d'ouvrir une route protégée
    cy.visit('/sessions', { failOnStatusCode: false });

    // Doit retomber sur la page publique (selon tes guards)
    cy.location('pathname').should((p) => {
      expect(['/','/login']).to.include(p);
    });
  });

  it('reste déconnecté après refresh (UI visible)', () => {
    cy.contains('mat-toolbar .link', 'Logout', { matchCase: false }).click();

    cy.reload(); // pas de re-login auto attendu
    cy.get('mat-toolbar').within(() => {
      cy.contains('Login').should('be.visible');
      cy.contains('Logout').should('not.exist');
    });
  });
});
