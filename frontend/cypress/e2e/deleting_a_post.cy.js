describe("Deleting post", () => {
  before(() => {
    cy.signup("user@email.com", "12345678", "username");
    cy.login("user@email.com", "12345678");
  });

  it("when a post is deleted, page is refreshed to see it removed", () => {
    cy.visit("/posts");
    cy.get("#postContent").type("e2e test delete post");
    cy.get("#submitButton").click();
    cy.get('[data-cy="deleteButton"]').first().click();
    cy.get('#confirmDeleteButton').click()

    cy.get("#feed").not("contain.text", "e2e test delete post");
  });
});