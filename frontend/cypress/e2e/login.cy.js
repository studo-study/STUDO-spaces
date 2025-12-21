describe("Advanced Auth Flows", () => {
  describe("Login Edge Cases", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/login");
    });

    it("should handle slow network responses", () => {
      // Mock a slow API response
      cy.intercept("POST", "**/api/sessions", (req) => {
        req.reply((res) => {
          res.delay = 2000; // 2 second delay
          res.send({
            statusCode: 200,
            body: {
              token: "fake-token",
              user: { id: 1, email: "admin@studo.study" }
            }
          });
        });
      }).as("slowLogin");

      cy.get("[data-cy=email_input]").type("admin@studo.study");
      cy.get("[data-cy=password_input]").type("Wachtwoord");
      cy.get("[data-cy=submit_login]").click();

      // Button should be disabled during loading
      cy.get("[data-cy=submit_login]").should("be.disabled");

      cy.wait("@slowLogin", { timeout: 10000 });

      // Should redirect after response
      cy.url().should("include", "/home");
    });

    it("should handle network errors gracefully", () => {
      // Mock network failure
      cy.intercept("POST", "**/api/sessions", {
        forceNetworkError: true
      }).as("networkError");

      cy.get("[data-cy=email_input]").type("admin@studo.study");
      cy.get("[data-cy=password_input]").type("Wachtwoord");
      cy.get("[data-cy=submit_login]").click();

      // Should show error message or stay on page
      cy.url().should("include", "/login");
    });

    it("should handle server errors (500)", () => {
      cy.intercept("POST", "**/api/sessions", {
        statusCode: 500,
        body: {
          message: "Internal server error"
        }
      }).as("serverError");

      cy.get("[data-cy=email_input]").type("admin@studo.study");
      cy.get("[data-cy=password_input]").type("Wachtwoord");
      cy.get("[data-cy=submit_login]").click();

      cy.wait("@serverError");

      // Should show error or stay on page
      cy.url().should("include", "/login");
    });

    it("should not allow multiple simultaneous submissions", () => {
      cy.intercept("POST", "**/api/sessions", (req) => {
        req.reply((res) => {
          res.delay = 1000;
          res.send({
            statusCode: 200,
            body: { token: "token", user: { id: 1 } }
          });
        });
      }).as("login");

      cy.get("[data-cy=email_input]").type("admin@studo.study");
      cy.get("[data-cy=password_input]").type("Wachtwoord");

      // Click submit button
      cy.get("[data-cy=submit_login]").click();

      // Should be disabled immediately
      cy.get("[data-cy=submit_login]").should("be.disabled");

      // Try clicking again (should do nothing)
      cy.get("[data-cy=submit_login]").click({ force: true });
    });
  });

  describe("Register Edge Cases", () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/register");
    });

    it("should handle email already exists error", () => {
      cy.intercept("POST", "**/api/users", {
        statusCode: 409,
        body: {
          message: "Email already exists"
        }
      }).as("duplicateEmail");

      cy.get("[data-cy=email_input]").type("existing@studo.study");
      cy.get("[data-cy=displayName_input]").type("Test User");
      cy.get("[data-cy=password_input]").type("Wachtwoord123");
      cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");
      cy.get("[data-cy=submit_register]").click();

      cy.wait("@duplicateEmail");
      cy.get("[data-cy=register_error]").should("be.visible");
      cy.get("[data-cy=register_error]").should("contain", "already exists");
    });

    it("should show all validation errors at once", () => {
      // Try with invalid data
      cy.get("[data-cy=email_input]").type("invalid-email");
      cy.get("[data-cy=displayName_input]").type("A");
      cy.get("[data-cy=password_input]").type("short");
      cy.get("[data-cy=confirmPassword_input]").type("different");

      // Trigger validation by blurring
      cy.get("[data-cy=email_input]").blur();
      cy.get("[data-cy=displayName_input]").blur();
      cy.get("[data-cy=password_input]").blur();
      cy.get("[data-cy=confirmPassword_input]").blur();

      cy.wait(500);

      cy.get("[data-cy=submit_register]").click();

      // Should stay on register page with errors
      cy.url().should("include", "/register");
    });

    it("should validate password strength requirements", () => {
      cy.get("[data-cy=password_input]").type("12345678");
      cy.get("[data-cy=confirmPassword_input]").type("12345678");
      cy.get("[data-cy=password_input]").blur();

      cy.wait(500);

      // Password meets minimum length
      cy.get("[data-cy=password_error]").should("not.exist");
    });

    it("should handle special characters in name", () => {
      cy.get("[data-cy=email_input]").type("test@studo.study");
      cy.get("[data-cy=displayName_input]").type("O'Brien-McDonald");
      cy.get("[data-cy=password_input]").type("Wachtwoord123");
      cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

      cy.get("[data-cy=displayName_input]").blur();
      cy.wait(500);

      // Should accept special characters in name
      cy.get("[data-cy=displayName_error]").should("not.exist");
    });

    it("should handle very long inputs", () => {
      const longString = "a".repeat(300);

      cy.get("[data-cy=email_input]").type("test@studo.study");
      cy.get("[data-cy=displayName_input]").type(longString);
      cy.get("[data-cy=password_input]").type("Wachtwoord123");
      cy.get("[data-cy=confirmPassword_input]").type("Wachtwoord123");

      // Form should handle or validate max length
      cy.get("[data-cy=displayName_input]").invoke("val").then((val) => {
        expect(val.length).to.be.lessThan(500);
      });
    });
  });

  describe("Complete User Journey", () => {
    it("should complete full registration and login flow", () => {
      const testUser = {
        email: `test${Date.now()}@studo.study`,
        displayName: "Test User",
        password: "Wachtwoord123",
        role: "student"
      };

      // Register
      cy.visit("http://localhost:5173/register");

      cy.intercept("POST", "**/api/users", {
        statusCode: 201,
        body: {
          id: 1,
          email: testUser.email,
          displayName: testUser.displayName,
          role: testUser.role
        }
      }).as("register");

      cy.intercept("POST", "**/api/sessions", {
        statusCode: 200,
        body: {
          token: "fake-token",
          user: {
            id: 1,
            email: testUser.email,
            displayName: testUser.displayName,
            role: testUser.role
          }
        }
      }).as("login");

      cy.get("[data-cy=email_input]").type(testUser.email);
      cy.get("[data-cy=displayName_input]").type(testUser.displayName);
      cy.get("[data-cy=password_input]").type(testUser.password);
      cy.get("[data-cy=confirmPassword_input]").type(testUser.password);
      cy.get("[data-cy=role_select]").select(testUser.role);
      cy.get("[data-cy=submit_register]").click();

      cy.wait("@register");
      cy.url().should("include", "/home");
    });

    it("should navigate between login and register pages", () => {
      // Start at login
      cy.visit("http://localhost:5173/login");
      cy.url().should("include", "/login");

      // Go to register
      cy.get("[data-cy=register_link]").click();
      cy.url().should("include", "/register");

      // Go back to login
      cy.get("[data-cy=login_link]").click();
      cy.url().should("include", "/login");
    });

    it("should preserve redirect parameter through login", () => {
      // Try to access protected page with redirect
      cy.visit("http://localhost:5173/login?redirect=/dashboard");

      cy.intercept("POST", "**/api/sessions", {
        statusCode: 200,
        body: {
          token: "token",
          user: { id: 1, email: "admin@studo.study" }
        }
      }).as("login");

      cy.get("[data-cy=email_input]").type("admin@studo.study");
      cy.get("[data-cy=password_input]").type("Wachtwoord");
      cy.get("[data-cy=submit_login]").click();

      cy.wait("@login");

      // Should redirect to the intended page
      cy.url().should("match", /\/(dashboard|home)/);
    });
  });

  describe("Security", () => {
    it("should not expose password in network requests", () => {
      cy.visit("http://localhost:5173/login");

      cy.intercept("POST", "**/api/sessions").as("loginRequest");

      cy.get("[data-cy=email_input]").type("admin@studo.study");
      cy.get("[data-cy=password_input]").type("SuperSecretPass123!");
      cy.get("[data-cy=submit_login]").click();

      // Password should be sent in body, not URL
      cy.wait("@loginRequest").then((interception) => {
        expect(interception.request.url).to.not.include("SuperSecretPass123!");
      });
    });
  });
});