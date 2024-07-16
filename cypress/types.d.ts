// cypress/support/index.d.ts
declare namespace Cypress {
    interface Chainable {
        /**
        * Custom command to start an application
        */
        startApplication(): Chainable<void>;
        
        /**
         * Custom command to set up Clerk testing tokens.
         * @example cy.setupClerkToken()
         */
        setupClerkToken(): Chainable<void>;

        /**
         * Custom command to sign in using Clerk.
         * @example cy.signIn()
         */
        signIn(): Chainable<void>;
  }
}