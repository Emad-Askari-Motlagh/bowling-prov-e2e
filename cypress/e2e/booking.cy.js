const endPoint = "http://localhost:5173";

describe("Booking", () => {
  beforeEach(() => {
    cy.visit(`${endPoint}`);
  });

  it("should fill in booking details, mock API response, and navigate to confirmation page", () => {
    // Fill in booking details
    const validDate = "2023-06-01";
    const validTime = "12:00 PM";
    cy.get('input[name="when"]').type(validDate);
    cy.get('input[name="time"]').type(validTime);
    cy.get('input[name="people"]').type("1");
    cy.get('input[name="lanes"]').type("1");

    cy.get('input[name="when"]').should("have.value", validDate);
    cy.get('input[name="time"]').should("have.value", validTime);

    cy.get(".plus-shoe").click(); // Add show
    cy.wait(1000);
    cy.get('input[name="1"]').type("27");
    cy.wait(1000);

    // Step 3: Verify the dynamic creation of shoe size fields
    cy.get(".shoes__form").should("have.length", 1); // Adjust the expected length based on the initial number of players

    // Step 4: Increase the number of players
    cy.get('input[name="people"]').clear().type("2"); // Adjust the number of players accordingly
    cy.get(".plus-shoe").click(); // Add shoe
    cy.wait(1000);
    cy.get('input[name="2"]').type("27");
    cy.wait(1000);

    cy.get(".shoes__form").should("have.length", 2); // Adjust the expected length based on the updated number of playersx
    //Remove the last shoe
    cy.get(".shoes__button--small").first().click();
    // Step 5: Decrease the number of players
    cy.get('input[name="people"]').clear().type("1"); // Adjust the number of players accordingly
    cy.get(".shoes__form").should("have.length", 1); // Adjust the expected length based on the updated number of players

    // Submit the form
    cy.get("button.booking__button").click();
    // Intercept the API request and mock the response
    cy.intercept(
      "POST",
      "https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com",
      (req) => {
        req.headers["Content-Type"] = "application/json";
        req.headers["x-api-key"] = "738c6b9d-24cf-47c3-b688-f4f4c5747662";
      }
    ).as("sendBooking");
    cy.wait("@sendBooking").then((interception) => {
      cy.visit(`${endPoint}/confirmation`, {
        state: {
          confirmationDetails: {
            when: "2023-05-30T09:00:00",
            people: 1,
            lanes: 1,
          },
        },
      }).then(() => {
        cy.location("pathname").should("eq", "/confirmation"); // Verify if the correct page is loaded

        cy.get(".confirmation__details").should("exist"); // Verify if the details form is rendered
        cy.wait(1000);
        cy.get(".confirmation__button").click();
        it("populates the form with state values", () => {
          cy.wait(1000);
          // Get the state from the URL
          cy.url().then((url) => {
            const queryString = url.split("?")[1];
            const state = JSON.parse(
              decodeURIComponent(queryString.split("=")[1])
            );

            cy.wait(1000);
            // Check that the form is rendered
            cy.get(".confirmation__details").should("exist");
            // Check that the form fields are populated with the state values
            cy.get(".confirmation__input")
              .eq(0)
              .should(
                "have.value",
                state.confirmationDetails.when.replace("T", " ")
              );
            cy.get(".confirmation__input")
              .eq(1)
              .should("have.value", state.confirmationDetails.people);
            cy.get(".confirmation__input")
              .eq(1)
              .should("have.value", state.confirmationDetails.lanes);
            cy.get(".confirmation__input")
              .eq(3)
              .should("have.value", state.confirmationDetails.id);
            cy.get(".confirmation__price p:last-child").should(
              "have.text",
              `${state.confirmationDetails.price} sek`
            );
            cy.get('input[name="Booking number"]').should(
              "have.value",
              state.confirmationDetails.id
            );
            cy.get(".confirmation__button")
              .should("exist")
              .should("have.text", "Sweet, let's go!");
            cy.get(".confirmation__no-booking").should("exist");
          });
        });
      });
    });
  });
});
