describe('Statistics test', () => {
    beforeEach(() => {  
        cy.signIn();
    });

    it('should display no data text if there`s no entries', () => {
        cy.deleteAllEntries();
        cy.visit('/statistics');
        cy.get('[data-testid=statisticsPage]').within(() => {
            cy.get('p').contains('There is no data to display yet.');
        });
        cy.wait(2000);
    });
    it('should display analytics for existing entries', () => {
        cy.addNewEntry();
        cy.visit('/statistics');
        cy.get('[data-testid=statisticsPage]').within(() => {
            cy.get('p').contains('Average sentiment:');
        });
    });
})