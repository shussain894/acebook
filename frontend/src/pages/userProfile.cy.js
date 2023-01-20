import UserProfile from './userProfile.js'
const navigate = () => {}

describe("UserProfile", () => {
  it("Calls the /users endpoint and displays the user", { defaultCommandTimeout: 10000 }, () => {
    window.localStorage.setItem("token", "fakeToken")
    
    
    cy.intercept('GET', '/users', (req) => {
        req.reply({
          statusCode: 200,
          body: { user: 
            {_id: 1, username: "username"},
          }
        })
      }
    ).as("getUsers")

    cy.mount(<UserProfile navigate={navigate}/>)
    
    cy.wait("@getUsers").then(() =>{
      cy.get('[data-cy="user"]')
      .should('contain.text', "username")
    })
  })

  it("displays the users posts", { defaultCommandTimeout: 10000 }, () => {
    window.localStorage.setItem("token", "fakeToken")
    
    cy.intercept('GET', '/posts/user', (req) => {
      req.reply({
        statusCode: 200,
        body: { posts: [ {_id: 1, message: "hello", likes: [], user_id: 1, hearts: [], fires: [], angrys: []}]
        }
      })
    }
  ).as("getPosts")

  cy.mount(<UserProfile navigate={navigate}/>)
    
    cy.wait("@getPosts").then(() =>{
      cy.get('[data-cy="post"]')
      .should('contain.text', "hello")
    })
  })
})

