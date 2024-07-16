import { setupClerkTestingToken } from '@clerk/testing/cypress';

Cypress.Commands.add('setupClerkToken', () => {
  setupClerkTestingToken();
});

Cypress.Commands.add('signIn', () => {
  cy.setupClerkToken();

  cy.visit(`${Cypress.env('DEV_URL')}/sign-in`);
  cy.get('input[name=identifier]').type(Cypress.env('test_user'));
  cy.get('.cl-formButtonPrimary').contains('button', 'Continue').click();
  cy.get('input[name=password]').type(Cypress.env('test_password'));
  cy.get('.cl-formButtonPrimary').contains('button', 'Continue').click();

  cy.url().should('include', '/journal');
});
