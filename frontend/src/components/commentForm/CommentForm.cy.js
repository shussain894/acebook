import CommentForm from './CommentForm'

const navigate = () => {}

describe("Commentform", () => {
  it('renders a post form', () => {
    cy.mount(<CommentForm/>);
    cy.get('[data-cy="submitButton"]').should('contains.text', "Add Comment")
  })

  it("can create a POST request to /posts", () => {
    
    cy.mount(<CommentForm navigate={navigate}/>);
    
    cy.intercept('POST', '/comments', { text: "This is a comment" }).as("createCommentRequest")

    cy.get("#commentContent").type("Making a comment");    
    cy.get("#submitButton").click();
    cy.wait('@createCommentRequest').then( interception => {
      expect(interception.response.body.text).to.eq("This is a comment")
    })
  })
})
