describe('Delete entry from Journal page', () => {
  it('should delete all existing entries', () => {
      cy.signIn();
      cy.addNewEntry();
      cy.visit('/journal');
      cy.deleteAllEntries();
  });
});
  