import Comments from "./Comments";

describe("Comment", () => {
  // not sure if we need this test anymore, as no elements to test that aren't on comment form tests
  xit("renders a comment", () => {
    cy.mount(<Comments />)
    cy.get('[data-cy="comment"]').should('contain.text', 'Comments here')
  })
});