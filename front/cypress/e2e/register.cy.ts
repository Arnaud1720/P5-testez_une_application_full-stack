/// <reference types="cypress" />
// 1) Un petit générateur « maison » de 6 caractères base36
function randomString(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len);
}

describe('create new account',()=>{
  const firstName =   `Arnaud_${new Date().getFullYear()}`;
  const lastName =   `Derisbourg_${new Date().getFullYear()}`;
  const email = `arnaud${randomString()}@gmail.com`;
  const emailto= 'arnaud68ls7x@gmail.com';
  beforeEach(() => {
    cy.visit('/');
  })
  it('Should create account', ()=>{
    cy.get("span[routerlink='register']").click()
    cy.get('#mat-input-0').type(firstName,{force:true})
    cy.get('#mat-input-1').type(lastName,{force:true})
    cy.get('#mat-input-2').type(email,{force:true})
    cy.get('#mat-input-3').type("Arnaud332114#",{force:true})
    cy.get(".mat-button-wrapper").contains("Submit").click()
    cy.on("window:alert",(validerAvecSucess)=>{
      expect(validerAvecSucess).to.equals("Sign up successfully")
    })
  })

  it('Should display error if server returns 500', () => {
    // Intercepte la requête POST vers /api/auth/register (adapte l’URL à ton projet)
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 500,
      body: { message: "Erreur interne serveur" }
    }).as('registerCall');

    cy.get("span[routerlink='register']").click();
    cy.get('#mat-input-0').type(firstName, { force: true });
    cy.get('#mat-input-1').type(lastName, { force: true });
    cy.get('#mat-input-2').type(email, { force: true });
    cy.get('#mat-input-3').type("Arnaud332114#", { force: true });
    cy.get(".mat-button-wrapper").contains("Submit").click();

    cy.wait('@registerCall');

    // Vérifie que l’erreur s’affiche dans le front
    cy.contains("Erreur interne serveur").should('be.visible'); // adapte selon ton message d’erreur front
  });

  it('Should display error if server returns 404', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 404,
      body: { message: "Ressource non trouvée" }
    }).as('registerCall');

    cy.get("span[routerlink='register']").click();
    cy.get('#mat-input-0').type(firstName, { force: true });
    cy.get('#mat-input-1').type(lastName, { force: true });
    cy.get('#mat-input-2').type(email, { force: true });
    cy.get('#mat-input-3').type("Arnaud332114#", { force: true });
    cy.get(".mat-button-wrapper").contains("Submit").click();

    cy.wait('@registerCall');

    // Vérifie que l’erreur s’affiche dans le front
    cy.contains("Ressource non trouvée").should('be.visible'); // adapte selon ton message d’erreur front
  });

  it('Should display error if server returns 401', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 401,
      body: { message: "Vous devez être connecté(e)" }
    }).as('registerCall');

    cy.get("span[routerlink='register']").click();
    cy.get('#mat-input-0').type(firstName, { force: true });
    cy.get('#mat-input-1').type(lastName, { force: true });
    cy.get('#mat-input-2').type(email, { force: true });
    cy.get('#mat-input-3').type("Arnaud332114#", { force: true });
    cy.get(".mat-button-wrapper").contains("Submit").click();

    cy.wait('@registerCall');

    // Vérifie que l’erreur s’affiche dans le front
    cy.contains("Vous devez être connecté(e)").should('be.visible'); // adapte selon ton message d’erreur front
  });

  it('Should display error if server returns 501', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 501,
      body: { message: "Non implément" }
    }).as('registerCall');

    cy.get("span[routerlink='register']").click();
    cy.get('#mat-input-0').type(firstName, { force: true });
    cy.get('#mat-input-1').type(lastName, { force: true });
    cy.get('#mat-input-2').type(email, { force: true });
    cy.get('#mat-input-3').type("Arnaud332114#", { force: true });
    cy.get(".mat-button-wrapper").contains("Submit").click();

    cy.wait('@registerCall');

    // Vérifie que l’erreur s’affiche dans le front
    cy.contains("Non implément").should('be.visible'); // adapte selon ton message d’erreur front
  });

  it('Should create account', ()=> {
    cy.get("span[routerlink='register']").click()
    cy.get('#mat-input-0').type(firstName,{force:true})
    cy.get('#mat-input-1').type(lastName,{force:true})
    cy.get('#mat-input-2').type(emailto,{force:true})
    cy.get('#mat-input-3').type("Arnaud332114#",{force:true})
    cy.get(".mat-button-wrapper").contains("Submit").click()
    cy.on("window:alert",(validerAvecSucess)=>{
      expect(validerAvecSucess).to.equals("Sign up successfully")
    })

    cy.task('queryDb', {
      sql: 'SELECT * FROM USERS WHERE email = ?',
      values: [email]
    }).then((rows) => {
      expect(rows).to.have.length(1);
      expect(rows[0].email).to.eq(email);
    });

    // cy.task('cleanTable', { table: 'USERS' });
  });

  it('500() email exist in db ', ()=> {
    cy.get("span[routerlink='register']").click()
    cy.get('#mat-input-0').type(firstName,{force:true})
    cy.get('#mat-input-1').type(lastName,{force:true})
    cy.get('#mat-input-2').type(email,{force:true})
    cy.get('#mat-input-3').type("Arnaud332114#",{force:true})
    cy.get(".mat-button-wrapper").contains("Submit").click()
    cy.on("window:alert",(validerAvecSucess)=>{
      expect(validerAvecSucess).to.equals("Sign up successfully")
    })

    cy.task('queryDb', {
      sql: 'SELECT * FROM USERS WHERE email = ?',
      values: [email]
    }).then((rows) => {
      expect(rows).to.have.length(1);
      expect(rows[0].email).to.eq(email);
    });

    // Nettoie après
    // cy.task('cleanTable', { table: 'USERS' });
  });





})
