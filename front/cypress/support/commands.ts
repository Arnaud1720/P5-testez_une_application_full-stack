/// <reference types="cypress" />

Cypress.Commands.add('login', () => {


  cy.intercept('POST', '/api/auth/login', {
    statusCode: 200,
    body: {
      id: 64,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: true,
      token: 'fake-jwt'
    }
  }).as('loginRequest');

  cy.intercept('GET', '/api/session', { statusCode: 200, body: [] })
    .as('sessionRequest');


  cy.visit('/login');


  cy.get('input[formControlName=email]').type('arnauds0j0jf@gmail.com');
  cy.get('input[formControlName=password]').type('Arnaud#1140459');
  cy.get('button[type=submit]').click();


  cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  cy.url().should('include', '/sessions');
});
