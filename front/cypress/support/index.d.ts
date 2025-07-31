/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {

      login(): Chainable<Subject>;      // ou Chainable<void>
    }
  }
}
export {};
