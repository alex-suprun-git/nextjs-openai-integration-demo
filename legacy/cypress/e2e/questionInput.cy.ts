describe('Question input test', () => {
    it('should create a new entry and make a request to ChatGPT via prompt input', () => {
        cy.signIn();
        cy.addNewEntry();
        cy.visit('/journal');
        cy.get('[data-testid=promptInput-wrapper]').within(() => {
            cy.get('span').contains('Request an AI analysis of your notes (15 to 100 characters)');
            cy.get('input').type('How were my last few days?');
            cy.get('button').click();
        });
        cy.wait(3800);
        cy.get('[data-testid=promptInput-answer]').should('be.visible');
        cy.wait(2000);
        cy.deleteAllEntries()
    });
});