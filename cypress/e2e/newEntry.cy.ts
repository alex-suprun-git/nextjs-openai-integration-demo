describe('Adding a new entry', () => {
    it('should create a new entry and then delete it', () => {
        cy.signIn();
        cy.addNewEntry();
        cy.deleteNewEntry();
    });
  });
  