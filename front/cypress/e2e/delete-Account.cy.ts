/// <reference types="cypress" />
describe('Suppression du compte utilisateur', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        id: 64,
        username: 'userName',
        firstName: 'Arnaud',
        lastName: 'DERISBOURG',
        admin: false,
        email: 'arnaudefheur@gmail.com',
        token: 'fake.jwt.token' // 2 points pour ressembler à un vrai JWT
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/api/session', { statusCode: 200, body: [] }).as('sessionRequest');

    cy.intercept('GET', '**/api/user/**', {
      statusCode: 200,
      body: {
        id: 64,
        firstName: 'Arnaud',
        lastName: 'DERISBOURG',
        email: 'arnaudefheur@gmail.com',
        admin: false,
        createdAt: '2025-07-29T00:00:00Z',
        updatedAt: '2025-07-29T00:00:00Z'
      }
    }).as('getUser');

    cy.intercept('GET', '**/api/*/me', {
      statusCode: 200,
      body: {
        id: 64,
        firstName: 'Arnaud',
        lastName: 'DERISBOURG',
        email: 'arnaudefheur@gmail.com',
        admin: false,
        createdAt: '2025-07-29T00:00:00Z',
        updatedAt: '2025-07-29T00:00:00Z'
      }
    });

    cy.intercept('DELETE', '**/api/user/**', { statusCode: 204 }).as('deleteAccount');
  });

  it('supprime le compte et redirige vers la page de connexion', () => {
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('arnaudefheur@gmail.com');
    cy.get('input[formControlName=password]').type('motdepasse');
    cy.contains('button', 'Submit').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/sessions');

    cy.contains('span', 'Account').click();
    cy.url().should('include', '/me');
    cy.wait('@getUser');

    cy.get('[data-cy="delete-account"]').click();
    cy.wait('@deleteAccount');

    cy.contains('Login').should('be.visible');
    cy.contains('Register').should('be.visible');
  });
});
