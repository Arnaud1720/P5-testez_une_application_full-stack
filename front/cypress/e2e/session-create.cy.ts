/// <reference types="cypress" />

describe('Création d’une session', () => {

  beforeEach(() => cy.login());   // commande custom déjà définie

  it('crée une session via le formulaire', () => {


    const mockTeachers = [
      { id: 40, firstName: 'Jo', lastName: 'Smith' },
      { id: 41, firstName: 'oj',   lastName: 'Smiht' }
    ];
    cy.intercept('GET', '**/api/teacher', mockTeachers).as('getTeachers');


      cy.location('pathname').should('eq', '/sessions');
      cy.get('[data-cy="btn-create"]', { timeout: 15_000 })
        .should('be.visible')
        .click();

    cy.location('pathname').should('eq', '/sessions/create');
    cy.wait('@getTeachers');
    cy.get('[data-cy=session-name]').type('Yoga Matinal');
    cy.get('[data-cy=session-date]').type('2025-07-25');         // format yyyy-MM-dd
    cy.get('[data-cy="session-teacher"]').click();
    cy.contains('mat-option', 'Jo').click();
    cy.get('[data-cy=session-description]')
      .type('Séance intense de Vinyasa');


    cy.intercept('POST', '**/api/session', { statusCode: 201 }).as('postSession');


    cy.contains('button', 'Save').click();
    cy.wait('@postSession').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/sessions');
  });



});
