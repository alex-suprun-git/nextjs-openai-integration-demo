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

  cy.url().should('eq', `${Cypress.config().baseUrl}/journal`);
});


Cypress.Commands.add('signOut', () => {
  cy.get('.cl-userButtonTrigger').click();
  cy.get('.cl-button__signOut').click();

  cy.url().should('include', '/sign-in');
});

Cypress.Commands.add('deleteNewEntry', () => {
  cy.get('[data-testid=delete-entry-button]').click();
  cy.url().should('eq', `${Cypress.config().baseUrl}/journal`);
});

Cypress.Commands.add('addNewEntry', () => {
  cy.get('[data-testid=new-entry-button]').click();
  cy.url().should('include', '/new-entry');
  cy.get('[data-testid=alert-content-too-short]').contains('Please enter at least 30 characters.');
  cy.get('[data-testid=entry-content-field]').type('Good morning! Today is a beautiful day. I am grateful for the sunshine.');
  cy.wait(3500);
  cy.url().should('not.include', '/new-entry');
  cy.url().should('include', '/journal/');
  cy.get('[data-testid=analysis-item]').each(($el) => {
    cy.wrap($el).find('span').each(($span) => {
      cy.wrap($span).should('not.eq', 'unknown');
    });
  });
});


Cypress.Commands.add('deleteAllEntries', () => {
  cy.get('body').then($body => {
    if ($body.find('[data-testid=entryCard]').length) {
      cy.get('[data-testid=entryCard-edit-button]').each($button => {
        cy.wrap($button).click();
        cy.get('[data-testid=entryCard-context-menu]').should('be.visible');
        cy.get('[data-testid=entryCard-delete-button]').click();
      });
      cy.get('[data-testid=entryCard]').should('not.exist');
    } else {
      cy.log('No entry exists. Create a few first.');
    }
  });
});