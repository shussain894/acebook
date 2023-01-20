import PostForm from './PostForm'

const navigate = () => {}

describe("Postform", () => {
  it('renders a post form', () => {
    cy.mount(<PostForm/>);
    cy.get('[data-cy="submitButton"]').should('contains.text', "Create Post")
  })

  it("can create a POST request to /posts", () => {
    // cy.mount(<PostForm />)
    cy.mount(<PostForm navigate={navigate}/>);
    
    cy.intercept('POST', '/posts', { message: "OK" }).as("createPostRequest")

    cy.get("#postContent").type("Making a post");    
    cy.get("#submitButton").click();
    cy.wait('@createPostRequest').then( interception => {
      expect(interception.response.body.message).to.eq("OK")
    })
  })
})

