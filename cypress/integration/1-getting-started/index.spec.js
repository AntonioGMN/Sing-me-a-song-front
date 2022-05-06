import { faker } from "@faker-js/faker";

describe("test n2n", () => {
	it("total", () => {
		//cy.reset();
		const dados = {
			name: faker.name.findName(),
			link: "https://www.youtube.com/watch?v=NrgmdOz227I",
		};

		cy.visit("http://localhost:3000/");

		cy.get('input[placeholder="Name"]').type(dados.name);
		cy.get("input[placeholder='https://youtu.be/...']").type(dados.link);
		cy.intercept("post", "/recommendations").as("getNewRecommnedation");
		cy.intercept("get", "/recommendations").as("getRecommnedations");
		cy.get("button").click();
		cy.wait("@getNewRecommnedation");

		cy.wait("@getRecommnedations");
		cy.contains(dados.name).should("be.visible");

		cy.intercept("post", "recommendations/*/upvote").as("upvote");
		cy.get("article div svg").first().click();
		cy.wait("@upvote");

		for (let i = 0; i < 8; i++) {
			cy.intercept("post", "recommendations/*/downvote").as("downvote");
			cy.get("svg").last().click();
			cy.wait("@downvote");
		}

		cy.wait("@getRecommnedations");
		cy.contains("No recommendations yet! Create your own :)");

		cy.get('input[placeholder="Name"]').type(dados.name);
		cy.get("input[placeholder='https://youtu.be/...']").type(dados.link);
		cy.get("button").click();
		cy.wait("@getNewRecommnedation");

		cy.get("svg").eq(2).click();
		cy.url().should("eq", "http://localhost:3000/top");
		cy.contains(dados.name).should("be.visible");

		cy.get("svg").eq(3).click();
		cy.url().should("eq", "http://localhost:3000/random");
		cy.contains(dados.name).should("be.visible");
	});
});
