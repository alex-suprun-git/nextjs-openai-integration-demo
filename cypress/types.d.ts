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


        /**
         * Custom command to sign out using Clerk.
         * @example cy.signOut()
         */
        signOut(): Chainable<void>;

        /**
         * Custom command to add a new entry.
         * @example cy.addNewEntry()
         */
        addNewEntry(): Chainable<void>;

        /**
         * Custom command to delete a new entry.
         * @example cy.deleteNewEntry()
         */
        deleteNewEntry(): Chainable<void>;

        /**
         * Custom command to delete all entries.
         * @example cy.deleteAllEntries()
         */
        deleteAllEntries(): Chainable<void>;  
  }
}