describe("Central de Atendimento ao Cliente TAT", () => {
    const TREE_SECONDS_IN_MS = 3000;

    beforeEach(() => {
        cy.visit("./src/index.html");
    });

    it("verifica o título da aplicação", () => {
        cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
    });

    it("preenche os campos obrigatorio e envia o formulario", () => {
        const longText =
            "Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste";

        cy.clock();
        cy.get("#firstName").type("Raul");
        cy.get("#lastName").type("Souza");
        cy.get("#email").type("raul@email.com");
        cy.get("#open-text-area").type(longText, { delay: 0 });
        cy.contains("button", "Enviar").click();
        cy.get(".success").should("be.visible");
        cy.tick(TREE_SECONDS_IN_MS);
        cy.get(".success").should("not.be.visible");
    });

    it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
        cy.clock();
        cy.get("#firstName").type("Raul");
        cy.get("#lastName").type("Souza");
        cy.get("#email").type("raul@email,com");
        cy.get("#open-text-area").type("Teste");
        cy.contains("button", "Enviar").click();

        cy.get(".error").should("be.visible");
        cy.tick(TREE_SECONDS_IN_MS);
        cy.get(".error").should("not.be.visible");
    });

    it("campo telefone continua vazio quando preenchido com valor não-numerico", () => {
        cy.get("#phone").type("teste").should("have.text", "");
    });

    it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
        cy.clock();
        cy.get("#firstName").type("Raul");
        cy.get("#lastName").type("Souza");
        cy.get("#email").type("raul@email.com");
        cy.get("#phone-checkbox").check().should("be.checked");
        cy.get("#open-text-area").type("Teste");
        cy.contains("button", "Enviar").click();

        cy.get(".error").should("be.visible");
        cy.tick(TREE_SECONDS_IN_MS);
        cy.get(".error").should("not.be.visible");
    });

    it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
        cy.get("#firstName")
            .type("Raul")
            .should("have.value", "Raul")
            .clear()
            .should("have.value", "");
        cy.get("#lastName")
            .type("Souza")
            .should("have.value", "Souza")
            .clear()
            .should("have.value", "");
        cy.get("#email")
            .type("raul@email.com")
            .should("have.value", "raul@email.com")
            .clear()
            .should("have.value", "");
        cy.get("#phone")
            .type("1234567890")
            .should("have.value", "1234567890")
            .clear()
            .should("have.value", "");
    });

    it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
        cy.clock();
        cy.contains("button", "Enviar").should("be.visible").click();
        cy.get(".error").should("be.visible");
        cy.tick(TREE_SECONDS_IN_MS);
        cy.get(".error").should("not.be.visible");
    });

    it("envia o formuário com sucesso usando um comando customizado", () => {
        cy.clock();
        cy.fillMandatoryFieldsAndSubmit();
        cy.get(".success").should("be.visible");
        cy.tick(TREE_SECONDS_IN_MS);
        cy.get(".success").should("not.be.visible");
    });

    it("seleciona um produto (YouTube) por seu texto", () => {
        cy.get("#product").select("YouTube").should("have.value", "youtube");
    });

    it("seleciona um produto (Mentoria) por seu valor (value)", () => {
        cy.get("#product").select("mentoria").should("have.value", "mentoria");
    });

    it("seleciona um produto (Blog) por seu índice", () => {
        cy.get("#product").select(1).should("have.value", "blog");
    });

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should("have.value", "feedback");
    });

    it("marca cada tipo de atendimento", () => {
        cy.get('input[type="radio"]')
            .should("have.length", 3)
            .each(($radio) => {
                cy.wrap($radio).check().should("be.checked");
            });
    });

    it("marca ambos checkboxes, depois desmarca o último", () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should("be.checked")
            .last()
            .uncheck()
            .should("not.be.checked");
    });

    it("seleciona um arquivo da pasta fixtures", () => {
        cy.get('input[type="file"]#file-upload')
            .should("not.have.value")
            .selectFile("cypress/fixtures/example.json")
            .should(($input) => {
                expect($input[0].files[0].name).to.equal("example.json");
            });
    });

    it("seleciona um arquivo simulando um drag-and-drop", () => {
        cy.get('input[type="file"]#file-upload')
            .should("not.have.value")
            .selectFile("cypress/fixtures/example.json", {
                action: "drag-drop",
            })
            .should(($input) => {
                expect($input[0].files[0].name).to.equal("example.json");
            });
    });

    it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
        cy.fixture("example.json").as("sampleFile");

        cy.get('input[type="file"]#file-upload').selectFile("@sampleFile");
    });

    it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
        cy.get("#privacy a")
            .should("have.attr", "href", "privacy.html")
            .and("have.attr", "target", "_blank");
    });

    it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
        cy.get("#privacy a").invoke("removeAttr", "target").click();
        cy.contains("Talking About Testing").should("be.visible");
    });

    it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
        cy.get(".success")
            .should("not.be.visible")
            .invoke("show")
            .should("be.visible")
            .and("contain", "Mensagem enviada com sucesso.")
            .invoke("hide")
            .should("not.be.visible");
        cy.get(".error")
            .should("not.be.visible")
            .invoke("show")
            .should("be.visible")
            .and("contain", "Valide os campos obrigatórios!")
            .invoke("hide")
            .should("not.be.visible");
    });

    it("preenche a area de texto usando o comando invoke", () => {
        const longText = Cypress._.repeat("0123456789", 20);

        cy.get("#open-text-area")
            .should("have.value", "")
            .invoke("val", longText)
            .should("have.value", longText);
    });

    // it.only("faz uma requisição HTTP", () => {
    //     cy.request({
    //         method: "GET",
    //         url: "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html",
    //     }).then((response) => {
    //         expect(response.status).to.equal(200);
    //         expect(response.statusText).to.equal("OK");
    //         expect(response.body).includes("CAC TAT");
    //     });
    // });

    it("faz uma requisição HTTP", () => {
        cy.request(
            "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
        ).should((response) => {
            const { status, statusText, body } = response;

            expect(status).to.equal(200);
            expect(statusText).to.equal("OK");
            expect(body).includes("CAC TAT");
        });
    });

    it.only("encontrando o gato", () => {
        cy.get("#cat")
            .should("not.be.visible")
            .invoke("show")
            .should("be.visible");
        cy.get("#title").invoke("text", "CAT TAT");
        cy.get("#subtitle").invoke("text", "Eu <3 gatos!");
    });
});
