describe("Home Page Tests", () => {
  it("Check the Links in the Navbar", () => {
    cy.visit("/")
    cy.contains("Quality Data ready to Integrate")
  });
});