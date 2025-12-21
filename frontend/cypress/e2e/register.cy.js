describe("Register", () => {
  beforeEach(() => {
    // Visit register page before each test
    cy.visit("http://localhost:5173/register");
  });

  it("should successfully register with valid data", () => {
    // Mock successful registration
    cy.intercept("POST", "**/api/users", {
      statusCode: 201,
      body: {
        id: 1,
        email: "newuser@studo.study",
        displayName: "Test User",
        role: "student"
      }
    }).as("registerRequest");

    // Mock the auto-login after registration
    cy.intercept("POST", "**/api/sessions", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          email: "newuser@studo.study",
          displayName: "Test User",
          role: "student"
        }
      }
    }).as("loginRequest");

    // Fill in all required fields
    cy.get("[data-cy=email_input]").type("newuser@studo.study");
    cy.get("[data-cy=displayName_input]").type("Test User");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");
    cy.get("[data-cy=role_select]").select("student");

    // Submit the form
    cy.get("[data-cy=submit_register]").click();

    // Wait for API call
    cy.wait("@registerRequest");

    // Check if redirected to home page
    cy.url().should("include", "/home");
  });

  it("should show error when email is invalid", () => {
    // Type invalid email
    cy.get("[data-cy=email_input]").type("invalid-email");
    cy.get("[data-cy=displayName_input]").type("Test User");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

    // Trigger validation by clicking elsewhere or blur
    cy.get("[data-cy=email_input]").blur();

    // Wait a moment for validation to process
    cy.wait(500);

    // Check for error message
    cy.get("[data-cy=email_error]").should("be.visible");
    cy.get("[data-cy=email_error]").should("contain", "Invalid email address");
  });

  it("should show error when name is too short", () => {
    cy.get("[data-cy=email_input]").type("test@studo.study");
    cy.get("[data-cy=displayName_input]").type("A");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

    // Trigger validation
    cy.get("[data-cy=displayName_input]").blur();
    cy.wait(500);

    // Check for error message
    cy.get("[data-cy=displayName_error]").should("be.visible");
    cy.get("[data-cy=displayName_error]").should("contain", "at least 2 characters");
  });

  it("should show error when password is too short", () => {
    cy.get("[data-cy=email_input]").type("test@studo.study");
    cy.get("[data-cy=displayName_input]").type("Test User");
    cy.get("[data-cy=password_input]").type("pass");
    cy.get("[data-cy=confirmPassword_input]").type("pass");

    // Trigger validation
    cy.get("[data-cy=password_input]").blur();
    cy.wait(500);

    // Check for error message
    cy.get("[data-cy=password_error]").should("be.visible");
    cy.get("[data-cy=password_error]").should("contain", "at least 8 characters");
  });

  it("should show error when passwords do not match", () => {
    cy.get("[data-cy=email_input]").type("test@studo.study");
    cy.get("[data-cy=displayName_input]").type("Test User");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("DifferentPassword");

    // Trigger validation
    cy.get("[data-cy=confirmPassword_input]").blur();
    cy.wait(500);

    // Check for error message
    cy.get("[data-cy=confirmPassword_error]").should("be.visible");
    cy.get("[data-cy=confirmPassword_error]").should("contain", "do not match");
  });

  it("should show error when email is empty", () => {
    cy.get("[data-cy=displayName_input]").type("Test User");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

    // Submit form
    cy.get("[data-cy=submit_register]").click();

    // Form should not submit - user stays on register page
    cy.url().should("include", "/register");
  });

  it("should show error when displayName is empty", () => {
    cy.get("[data-cy=email_input]").type("test@studo.study");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

    // Submit form
    cy.get("[data-cy=submit_register]").click();

    // Form should not submit
    cy.url().should("include", "/register");
  });

  it("should toggle password visibility", () => {
    // Type password
    cy.get("[data-cy=password_input]").type("Wachtwoord123");

    // Password should be hidden by default
    cy.get("[data-cy=password_input]").should("have.attr", "type", "password");
    cy.get("[data-cy=confirmPassword_input]").should("have.attr", "type", "password");

    // Click toggle button
    cy.get("[data-cy=toggle_password_visibility]").click();

    // Both password fields should now be visible
    cy.get("[data-cy=password_input]").should("have.attr", "type", "text");
    cy.get("[data-cy=confirmPassword_input]").should("have.attr", "type", "text");
  });

  it("should allow selecting different roles", () => {
    cy.get("[data-cy=role_select]").select("teacher");
    cy.get("[data-cy=role_select]").should("have.value", "teacher");

    cy.get("[data-cy=role_select]").select("professor");
    cy.get("[data-cy=role_select]").should("have.value", "professor");

    cy.get("[data-cy=role_select]").select("student");
    cy.get("[data-cy=role_select]").should("have.value", "student");
  });

  it("should navigate to login page when clicking login link", () => {
    cy.get("[data-cy=login_link]").click();
    cy.url().should("include", "/login");
  });

  it("should show error message from API", () => {
    // Mock API error
    cy.intercept("POST", "**/api/users", {
      statusCode: 400,
      body: {
        message: "Email already exists"
      }
    }).as("registerRequest");

    // Fill in the form
    cy.get("[data-cy=email_input]").type("existing@studo.study");
    cy.get("[data-cy=displayName_input]").type("Test User");
    cy.get("[data-cy=password_input]").type("Wachtwoord123");
    cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

    // Submit form
    cy.get("[data-cy=submit_register]").click();

    // Wait for API call
    cy.wait("@registerRequest");

    // Check if error message is displayed
    cy.get("[data-cy=register_error]").should("be.visible");
  });

  it("should have Google registration button", () => {
    cy.get("[data-cy=register_google]").should("exist");
  });

  it("should have Microsoft registration button", () => {
    cy.get("[data-cy=register_microsoft]").should("exist");
  });
});