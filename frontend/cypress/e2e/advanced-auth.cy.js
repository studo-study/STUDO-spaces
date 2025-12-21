describe("Create/Edit Studyset", () => {

  //wegens tijdsgebrek is dit niet gelukt.
  const setupAuth = () => {
    cy.intercept("POST", "**/api/sessions", {
      statusCode: 200,
      body: {
        token: "fake-jwt-token",
        user: {
          id: 1,
          email: "admin@studo.study",
          displayName: "Admin User",
          role: "admin"
        }
      }
    }).as("login");

    cy.intercept("GET", "**/api/users/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "admin@studo.study",
        displayName: "Admin User",
        role: "admin"
      }
    }).as("getMe");

    cy.intercept("GET", "**/api/users/me/headers", {
      statusCode: 200,
      body: {
        notifications: [],
        unreadCount: 0
      }
    }).as("getHeaders");

    cy.intercept("GET", "**/api/users/me/start", {
      statusCode: 200,
      body: {
        recentSets: [],
        stats: {}
      }
    }).as("getStart");

    cy.intercept("GET", "**/api/search/**", {
      statusCode: 200,
      body: {
        results: []
      }
    }).as("search");

    cy.intercept("GET", "**/folders/me", {
      statusCode: 200,
      body: {
        folders: [
          { id: 1, name: "Biology" },
          { id: 2, name: "Mathematics" },
          { id: 3, name: "History" }
        ]
      }
    }).as("getFolders");
  };

  const login = () => {
    setupAuth();

    cy.visit("http://localhost:5173/login");
    cy.get("[data-cy=email_input]").type("admin@studo.study");
    cy.get("[data-cy=password_input]").type("Wachtwoord");
    cy.get("[data-cy=submit_login]").click();
    cy.wait("@login");
  };

  beforeEach(() => {
    setupAuth();
  });

  describe("Create New Studyset", () => {
    beforeEach(() => {
      login();
      cy.visit("http://localhost:5173/studysets/create");
    });

    it("should display create studyset form with all fields", () => {
      cy.get("[data-cy=title_input]").should("exist");
      cy.get("[data-cy=course_input]").should("exist");
      cy.get("[data-cy=folder_select]").should("exist");
      cy.get("[data-cy=term_language_select]").should("exist");
      cy.get("[data-cy=definition_language_select]").should("exist");
      cy.get("[data-cy=import_button]").should("exist");
      cy.get("[data-cy=add_card_button]").should("exist");
      cy.get("[data-cy=submit_studyset_top]").should("exist");
      cy.get("[data-cy=submit_studyset_bottom]").should("exist");
      cy.get("[data-cy=cards_container]").should("exist");
    });

    it("should have 3 cards by default", () => {
      cy.get("[data-cy=cards_container]").children().should("have.length", 3);
    });

    it("should successfully create a studyset with valid data", () => {
      cy.intercept("POST", "**/studysets", {
        statusCode: 201,
        body: {
          id: 123,
          title: "Biology 101",
          course: "Introduction to Biology"
        }
      }).as("createStudyset");

      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Introduction to Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");

      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.wait("@createStudyset");

      cy.url().should("include", "/studysets/123");
    });

    it("should show validation error when title is empty", () => {
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");

      cy.get("[data-cy=title_input]").focus().blur();
      cy.wait(500);

      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.url().should("include", "/studysets/create");
      cy.get("[data-cy=title_error]").should("be.visible");
    });

    it("should show validation error when course is empty", () => {
      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");

      cy.get("[data-cy=course_input]").focus().blur();
      cy.wait(500);

      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.get("[data-cy=course_error]").should("be.visible");
    });

    it("should show validation error when folder is not selected", () => {
      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");

      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.get("[data-cy=folder_error]").should("be.visible");
    });

    it("should show validation error when term language is not selected", () => {
      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=definition_language_select]").select("nl");

      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.get("[data-cy=term_language_error]").should("be.visible");
    });

    it("should show validation error when definition language is not selected", () => {
      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");

      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.get("[data-cy=definition_language_error]").should("be.visible");
    });

    it("should validate title max length", () => {
      const longTitle = "a".repeat(201);

      cy.get("[data-cy=title_input]").type(longTitle);
      cy.get("[data-cy=title_input]").blur();
      cy.wait(500);

      cy.get("[data-cy=title_error]").should("be.visible");
      cy.get("[data-cy=title_error]").should("contain", "200");
    });

    it("should validate course max length", () => {
      const longCourse = "a".repeat(101);

      cy.get("[data-cy=course_input]").type(longCourse);
      cy.get("[data-cy=course_input]").blur();
      cy.wait(500);

      cy.get("[data-cy=course_error]").should("be.visible");
      cy.get("[data-cy=course_error]").should("contain", "100");
    });

    it("should add a new card when clicking add card button", () => {
      cy.get("[data-cy=cards_container]").children().should("have.length", 3);
      cy.get("[data-cy=add_card_button]").click();
      cy.get("[data-cy=cards_container]").children().should("have.length", 4);
    });

    it("should add multiple cards", () => {
      cy.get("[data-cy=cards_container]").children().should("have.length", 3);
      cy.get("[data-cy=add_card_button]").click();
      cy.get("[data-cy=add_card_button]").click();
      cy.get("[data-cy=add_card_button]").click();
      cy.get("[data-cy=cards_container]").children().should("have.length", 6);
    });

    it("should load folders in the select dropdown", () => {
      cy.get("[data-cy=folder_select]").find("option").should("have.length", 4);
      cy.get("[data-cy=folder_select]").find("option").eq(1).should("contain", "Biology");
      cy.get("[data-cy=folder_select]").find("option").eq(2).should("contain", "Mathematics");
      cy.get("[data-cy=folder_select]").find("option").eq(3).should("contain", "History");
    });

    it("should have all language options available", () => {
      const languages = ["English", "Dutch", "French", "German", "Spanish"];

      cy.get("[data-cy=term_language_select]").find("option").should("have.length", 6);
      languages.forEach((lang) => {
        cy.get("[data-cy=term_language_select]").should("contain", lang);
      });

      cy.get("[data-cy=definition_language_select]").find("option").should("have.length", 6);
      languages.forEach((lang) => {
        cy.get("[data-cy=definition_language_select]").should("contain", lang);
      });
    });

    it("should disable submit button while saving", () => {
      cy.intercept("POST", "**/studysets", (req) => {
        req.reply((res) => {
          res.delay = 2000;
          res.send({
            statusCode: 201,
            body: { id: 123 }
          });
        });
      }).as("slowSave");

      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");
      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.get("[data-cy=submit_studyset_top]").should("be.disabled");
      cy.get("[data-cy=submit_studyset_bottom]").should("be.disabled");
    });

    it("should show import button", () => {
      cy.get("[data-cy=import_button]").should("be.visible");
      cy.get("[data-cy=import_button]").should("contain", "IMPORT");
    });

    it("should handle API errors gracefully", () => {
      cy.intercept("POST", "**/studysets", {
        statusCode: 500,
        body: { message: "Internal server error" }
      }).as("saveError");

      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");
      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.wait("@saveError");
      cy.url().should("include", "/studysets/create");
    });
  });

  describe("Edit Existing Studyset", () => {
    beforeEach(() => {
      login();

      cy.intercept("GET", "**/studysets/456", {
        statusCode: 200,
        body: {
          id: 456,
          title: "Existing Studyset",
          course: "Existing Course",
          folder_id: "2",
          global_term_language: "en",
          global_definition_language: "nl",
          cardlist: [
            {
              cards: [
                { term: "Term 1", definition: "Definition 1", image: "", number: 1 },
                { term: "Term 2", definition: "Definition 2", image: "", number: 2 },
                { term: "Term 3", definition: "Definition 3", image: "", number: 3 }
              ]
            }
          ]
        }
      }).as("getStudyset");

      cy.visit("http://localhost:5173/studysets/edit/456");
      cy.wait("@getStudyset");
    });

    it("should load existing studyset data", () => {
      cy.get("[data-cy=title_input]").should("have.value", "Existing Studyset");
      cy.get("[data-cy=course_input]").should("have.value", "Existing Course");
      cy.get("[data-cy=folder_select]").should("have.value", "2");
      cy.get("[data-cy=term_language_select]").should("have.value", "en");
      cy.get("[data-cy=definition_language_select]").should("have.value", "nl");
    });

    it("should successfully update studyset", () => {
      cy.intercept("PUT", "**/studysets/456", {
        statusCode: 200,
        body: { id: 456, title: "Updated Studyset" }
      }).as("updateStudyset");

      cy.get("[data-cy=title_input]").clear().type("Updated Studyset");
      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.wait("@updateStudyset");
      cy.url().should("include", "/studysets/456");
    });

    it("should show save set button text when editing", () => {
      cy.get("[data-cy=submit_studyset_top]").should("contain", "SAVE SET");
      cy.get("[data-cy=submit_studyset_bottom]").should("contain", "SAVE SET");
    });

    it("should preserve existing cards", () => {
      cy.get("[data-cy=cards_container]").children().should("have.length", 3);
    });
  });

  describe("Form Interactions", () => {
    beforeEach(() => {
      login();
      cy.visit("http://localhost:5173/studysets/create");
    });

    it("should allow selecting different folders", () => {
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=folder_select]").should("have.value", "1");
      cy.get("[data-cy=folder_select]").select("2");
      cy.get("[data-cy=folder_select]").should("have.value", "2");
    });

    it("should allow selecting different languages", () => {
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=term_language_select]").should("have.value", "en");
      cy.get("[data-cy=definition_language_select]").select("nl");
      cy.get("[data-cy=definition_language_select]").should("have.value", "nl");
    });

    it("should allow typing in all input fields", () => {
      cy.get("[data-cy=title_input]").type("Test Title");
      cy.get("[data-cy=title_input]").should("have.value", "Test Title");
      cy.get("[data-cy=course_input]").type("Test Course");
      cy.get("[data-cy=course_input]").should("have.value", "Test Course");
    });

    it("should be able to submit from both submit buttons", () => {
      cy.intercept("POST", "**/studysets", {
        statusCode: 201,
        body: { id: 789 }
      }).as("create");

      cy.get("[data-cy=title_input]").type("Biology 101");
      cy.get("[data-cy=course_input]").type("Biology");
      cy.get("[data-cy=folder_select]").select("1");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");
      cy.get("[data-cy=submit_studyset_top]").click();

      cy.wait("@create");
      cy.url().should("include", "/studysets/789");
    });

    it("should show correct button text for create mode", () => {
      cy.get("[data-cy=submit_studyset_top]").should("contain", "CREATE SET");
      cy.get("[data-cy=submit_studyset_bottom]").should("contain", "CREATE SET");
    });
  });

  describe("Complete User Flow", () => {
    it("should complete full studyset creation flow", () => {
      login();

      cy.intercept("POST", "**/studysets", {
        statusCode: 201,
        body: { id: 999, title: "Complete Biology Set" }
      }).as("create");

      cy.visit("http://localhost:5173/studysets/create");

      cy.get("[data-cy=title_input]").type("Complete Biology Set");
      cy.get("[data-cy=course_input]").type("Biology 101");
      cy.get("[data-cy=folder_select]").select("Biology");
      cy.get("[data-cy=term_language_select]").select("en");
      cy.get("[data-cy=definition_language_select]").select("nl");
      cy.get("[data-cy=add_card_button]").click();
      cy.get("[data-cy=add_card_button]").click();
      cy.get("[data-cy=cards_container]").children().should("have.length", 5);
      cy.get("[data-cy=submit_studyset_bottom]").click();

      cy.wait("@create");
      cy.url().should("include", "/studysets/999");
    });
  });
});