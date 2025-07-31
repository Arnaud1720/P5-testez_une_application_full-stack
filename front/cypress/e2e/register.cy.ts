/// <reference types="cypress" />
// 1) Un petit générateur « maison » de 6 caractères base36
function randomString(len = 6) {
  return Math.random().toString(36).slice(2, 2 + len);
}

describe('create new account',()=>{
  const firstName =   `Arnaud_${new Date().getFullYear()}`;
  const lastName =   `Derisbourg_${new Date().getFullYear()}`;
  const email = `arnaud${randomString()}@gmail.com`;
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

})
