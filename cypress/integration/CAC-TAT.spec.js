/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
    beforeEach(function () {
        cy.visit("./src/index.html");
    });
    it("verifica o título da aplicação", function () {
        cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
    });
    ///teste para verifcar campos
    it("preenche os campos obrigatórios e envia o formulário", function () {
        const longText =
            "Teste Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,Teste, Teste,";
        cy.get("#firstName").type("Vitor");
        cy.get("#lastName").type("Machado");
        cy.get("#email").type("vitor@teste.com");
        cy.get("#open-text-area").type(longText, { delay: 0 });
        cy.contains("button", "Enviar").click();

        cy.get(".success").should("be.visible");
    });
    ///testes de verificação de campos errados
    it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
        cy.get("#firstName").type("Vitor");
        cy.get("#lastName").type("Machado");
        cy.get("#email").type("vitor@teste,com");
        cy.get("#open-text-area").type("teste");
        cy.contains("button", "Enviar").click();
    });

    /// teste campo que só aceita numero
    it(" campo telefone continua vazio quando preenchido com valor não numerico", function () {
        cy.get("#phone").type("abcdefg").should("have.value", "");
    });

    it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
        cy.get("#firstName").type("Vitor");
        cy.get("#lastName").type("Machado");
        cy.get("#email").type("vitor@teste.com");
        cy.get("#phone-checkbox").check();
        cy.get("#open-text-area").type("teste");
        cy.contains("button", "Enviar").click();
        cy.get(".error").should("be.visible");
    });
    ///preenche e limpa
    it("preenche e limpa os campos nome, sobrenome, email e telefone", function () {
        cy.get("#firstName")
            .type("Vitor")
            .should("have.value", "Vitor")
            .clear()
            .should("have.value", "");
        cy.get("#lastName")
            .type("Machado")
            .should("have.value", "Machado")
            .clear()
            .should("have.value", "");
        cy.get("#email")
            .type("vitor@teste.com")
            .should("have.value", "vitor@teste.com")
            .clear()
            .should("have.value", "");
        cy.get("#phone")
            .type("777777")
            .should("have.value", "777777")
            .clear()
            .should("have.value", "");
    });

    ///exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios

    it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
        cy.contains("button", "Enviar").click();
        cy.get(".error").should("be.visible");
    });

    it("envia o formuário com sucesso usando um comando customizado", function () {
        cy.fillMandatoryFieldsAndSubmit();
        cy.get(".success").should("be.visible");
    });

    it("Seleciona um produto", function () {
        cy.get("#product").select("YouTube").should("have.value", "youtube");
    });

    it("selecionar  um produto pelo valor(value)", function () {
        cy.get("#product").select("mentoria").should("have.value", "mentoria");
    });

    it("valor pelo indice", function () {
        cy.get("#product").select(1).should("have.value", "blog");
    });

    it("Marcar tipo de atendimento", function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should("have.value", "feedback");
    });

    it("Marca cada tipo de radio", function () {
        cy.get('input[type="radio"]')
            .should("have.length", 3)
            .each(function ($radio) {
                cy.wrap($radio).check();
                cy.wrap($radio).should("be.checked");
            });
    });

    it("Marca ambos check box, desmarca ultimo", function () {
        cy.get('input[type="checkbox"]')
            .check()
            .should("be.checked")
            .last()
            .uncheck()
            .should("not.be.checked");
    });

    it("Fazendo upload de arquivos", function () {
        cy.get('input[type="file"]')
            .should("not.have.value")
            .selectFile("./cypress/fixtures/example.json")
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal("example.json");
            });
    });

    it("teste simulando drag-and-drop", function () {
        cy.get('input[type="file"]')
            .should("not.have.value")
            .selectFile("./cypress/fixtures/example.json", {
                action: "drag-drop",
            })
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal("example.json");
            });
    });

    it("selecione um arquivo usando uma fixture", () => {
        cy.fixture("example.json").as("sampleFile");
        cy.get('input[type="file"]')
            .selectFile("@sampleFile")
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal("example.json");
            });
    });

    it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
        cy.get("#privacy a").should("have.attr", "target", "_blank");
    });

    it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
        cy.get("#privacy a").invoke("removeAttr", "target").click();
        cy.contains("Talking About Testing").should("be.visible");
    });
});
