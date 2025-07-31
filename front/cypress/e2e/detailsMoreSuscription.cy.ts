/// <reference types="cypress" />



describe('Gestion de l’inscription à une séance', () => {
  const userId = 67;
  const sessionId = 1;
  const teacherId = 41;

  beforeEach(() => {
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

    let call = 0;
    cy.intercept('GET', `**/api/session/${sessionId}`, (req) => {
      call += 1;
      req.reply({
        statusCode: 200,
        body: {
          id: sessionId,
          name: 'Bbbbb',
          description: 'aaaaa',
          date: '2025-07-25T00:00:00Z',
          users: call === 1 ? [] : [{ id: userId }],
          teacher_id: teacherId
        }
      });
    }).as('getSession');

    cy.intercept('GET', `**/api/teacher/${teacherId}`, {
      id: teacherId,
      firstName: 'Jo',
      lastName: 'Smith'
    }).as('getTeacher');

    cy.intercept('POST',
      `**/api/session/${sessionId}/participate/**`, { statusCode: 200 })
      .as('participate');

    cy.intercept('DELETE',
      `**/api/session/${sessionId}/participate/**`, { statusCode: 200 })
      .as('unparticipate');
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
    cy.contains('button', /Do\s+not\s+participate/i).should('be.visible');

    cy.contains('button', /Do\s+not\s+participate/i).click();
    cy.wait('@unparticipate');
    cy.contains('button', 'Participate').should('be.visible');
  });
});
