describe("Signing up", () => {
  xit("with valid credentials, redirects to '/login'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone1@example.com");
    cy.get("#password").type("password");
    cy.get("#username").type("username1");
    cy.get("#submit").click();

    cy.url().should("include", "/login");
  });

  it("with missing password, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#email").type("someone@example.com");
    cy.get("#username").type("username");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });

  it("with missing email, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });

  it("with missing username, redirects to '/signup'", () => {
    cy.visit("/signup");
    cy.get("#email").type("email@test.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    cy.url().should("include", "/signup");
  });


  it("with missing email, error message appears'", () => {
    cy.visit("/signup");
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();

    cy.get(".errorMessages").should("contains.text", "All fields are required - please try again")
  });


  it("with an exsisting user, error message appears'", () => {
    cy.visit("/signup");
    cy.get("#email").type("email")
    cy.get("#password").type("password");
    cy.get("#username").type("username");
    cy.get("#submit").click();

    cy.get(".errorMessages").should("contains.text", "That user already exists - Please create a new account or login")
  });
});
