/// <reference types="cypress" />
describe('create new account',()=>{
  beforeEach(() => {
    cy.visit('/');
  })
  it('Should create account', ()=>{
    cy.get("span[routerlink='register']").click()
    cy.get('#mat-input-0').type("Arnaud",{force:true})
    cy.get('#mat-input-1').type("DERISBOURG",{force:true})
    cy.get('#mat-input-2').type("ArnaudTest@gmail.com",{force:true})
    cy.get('#mat-input-3').type("Arnaud332114#",{force:true})
    cy.get(".mat-button-wrapper").contains("Submit").click()
    cy.on("window:alert",(validerAvecSucess)=>{
      expect(validerAvecSucess).to.equals("Sign up successfully")
    })
  })
  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("ArnaudTest@gmail.com")
    cy.get('input[formControlName=password]').type(`${"Arnaud332114#"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
  })
})
