describe("Creating post", () => {

    before(() => {
      cy.signup("test@email.com", "12345678", "test")
      cy.login("test@email.com", "12345678")
    })
  
    it("Able to add comment to posts", () => {
      cy.visit("/posts");
      cy.get('.commentButton').first().click();
      cy.get("#commentContent").type("e2e test comment");
      cy.get("#submitButton").click();
      
      cy.get('#feed').should('contains.text', "e2e test comment");
    })
  })