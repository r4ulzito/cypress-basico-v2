Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
    cy.get("#firstName").type("Raul");
    cy.get("#lastName").type("Souza");
    cy.get("#email").type("raul@email.com");
    cy.get("#open-text-area").type("Teste");
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
});
