/// <reference types="cypress" />
describe('Gestion de l’inscription à une séance', () => {
  const userId = 47;
  const sessionId = 1;
  const teacherId = 1;
  let isParticipating = false;

  beforeEach(() => {
    isParticipating = false;

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        id: userId,
        username: 'userName',
        firstName: 'Arnaud',
        lastName: 'DERISBOURG',
        admin: false,
        token: 'fake.jwt.token'
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/api/session', {
      statusCode: 200,
      body: [
        { id: sessionId, name: 'Bbbbb',
          description: 'aaaaa',
          date: '2025-07-25T00:00:00Z' }
      ]
    }).as('getSessions');

    cy.intercept('GET', `**/api/session/${sessionId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: sessionId,
          name: 'Bbbbb',
          description: 'aaaaa',
          date: '2025-07-25T00:00:00Z',
          users: isParticipating ? [userId] : [], // 👈 le vrai état dynamique !
          teacher_id: teacherId
        }
      });
    }).as('getSession');

    cy.intercept('GET', `**/api/teacher/${teacherId}`, {
      id: teacherId,
      firstName: 'Jo',
      lastName: 'Smith'
    }).as('getTeacher');

    cy.intercept('POST', `**/api/session/${sessionId}/participate/**`, (req) => {
      isParticipating = true; // 👈 à l'inscription
      req.reply({ statusCode: 200 });
    }).as('participate');

    cy.intercept('DELETE', `**/api/session/${sessionId}/participate/**`, (req) => {
      isParticipating = false; // 👈 à la désinscription
      req.reply({ statusCode: 200 });
    }).as('unparticipate');
  });

  it('permet de participer puis de se désinscrire', () => {
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('arnaudtest@gmail.com');
    cy.get('input[formControlName=password]').type('Motdepasse#1');
    cy.contains('button', 'Submit').click();
    cy.wait('@loginRequest');

    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
    cy.contains('button', 'Detail').click();
    cy.wait('@getSession');  // 1er GET users=[]
    cy.wait('@getTeacher');

    cy.contains('button', 'Participate').should('be.visible').click();
    cy.wait('@participate');
    cy.wait('@getSession');
    cy.contains('button', /Do\s*not\s*participate/i).should('be.visible');

    cy.contains('button', /Do\s*not\s*participate/i).click();
    cy.wait('@unparticipate');
    cy.wait('@getSession');
    cy.contains('button', 'Participate').should('be.visible');
  });
  it('affiche une erreur si la participation échoue', () => {
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('arnaudtest@gmail.com');
    cy.get('input[formControlName=password]').type('Motdepasse#1');
    cy.contains('button', 'Submit').click();
    cy.wait('@loginRequest');

    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
    cy.contains('button', 'Detail').click();
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // Simule une erreur sur la participation
    cy.intercept('POST', `**/api/session/${sessionId}/participate/**`, {
      statusCode: 500,
      body: { message: "Erreur lors de l'inscription à la séance" }
    }).as('participateError');

    cy.get('[data-cy=btn-participate]').should('be.visible').click();
    cy.wait('@participateError');

    // Vérifie le snackbar (MatSnackBar ajoute toujours cette classe)
    cy.get('.mat-snack-bar-container').should('contain', "Erreur lors de l'inscription à la séance");
  });
  it('affiche une erreur si la désinscription échoue', () => {
    isParticipating = true; // Pour afficher directement le bouton "Do not participate"

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('arnaudtest@gmail.com');
    cy.get('input[formControlName=password]').type('Motdepasse#1');
    cy.contains('button', 'Submit').click();
    cy.wait('@loginRequest');

    cy.url().should('include', '/sessions');
    cy.wait('@getSessions');
    cy.contains('button', 'Detail').click();
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // Simule une erreur sur la désinscription
    cy.intercept('DELETE', `**/api/session/${sessionId}/participate/**`, {
      statusCode: 500,
      body: { message: "Erreur lors de la désinscription" }
    }).as('unparticipateError');

    cy.get('[data-cy=btn-unparticipate]').should('be.visible').click();
    cy.wait('@unparticipateError');
    cy.get('.mat-snack-bar-container').should('contain', "Erreur lors de la désinscription");
  });

});
