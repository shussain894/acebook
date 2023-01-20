describe("Liking post", () => {

  before(() => {
    cy.signup("user@email.com", "12345678", "username")
    cy.login("user@email.com", "12345678")
  })

  it("when a post is liked, page is refreshed to see it", () => {
    cy.visit("/posts");
    cy.get("#postContent").type("e2e test post");
    cy.get("#submitButton").click();
    cy.get("#likeButton").click();
    
    cy.get('#feed').should('contains.text', "heart_plus1");
  })

  it("when a post is liked and then unliked, page is refreshed to see it", () => {
    cy.visit("/posts");
    cy.get("#postContent").type("e2e test post 2");
    cy.get("#submitButton").click();
    cy.get("#likeButton").click();
    cy.get('#feed').should('contains.text', "heart_plus1");
    cy.get("#likeButton").click();
    cy.get('#feed').should('contains.text', "heart_plus0");
  })
})