describe('Login functionality test', () => {

  beforeEach(() => {
    cy.visit('/');
  }); 

  it('should display the home page correctly', () => {
    cy.get('h1').contains('AI-Powered Mood Analysis');
    cy.get('p').contains('This demo application, built with NextJS, TypeScript, Tailwind, Clerk, Prisma, and OpenAI, allows users to analyze their mood based on journal entries.');
    cy.get('button').should('exist');
  });

  it('should redirect to the login page if the user is not authenticated', () => {
    cy.get('button').contains('Get Started').click();
    cy.url().should('include', '/sign-in');
  });

  it('should redirect to the journal page if the user is authenticated', () => {
    cy.signIn();
  });
});
