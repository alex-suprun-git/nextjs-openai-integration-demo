describe('Logout functionality test', () => {
    it('should redirect to the login page if the user is logged out', () => {
      cy.signIn();
      cy.signOut();
    });
  });
  