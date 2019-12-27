/// <reference types="Cypress" />

const indexPath = Cypress.env('NODE_ENV') === 'production'
  ? '/build/index.html' : 'http://127.0.0.1:3000'

Cypress.Commands.add('visitIndex', (options = {}) => {
  cy.viewport(640, 500)
  cy.visit(indexPath, options)
})
