describe("내 상점 페이지", () => {
  it("탭이 잘 동작해야 한다", () => {
    cy.visit("http://localhost:3000/products/manage");
    cy.contains("상품 등록").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:3000/products/new");
    cy.contains("상품 관리").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:3000/products/manage");
    cy.contains("구매 / 판매 내역").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:3000/products/history/sell");
    cy.contains("구매 내역").click();
    cy.wait(2000);
    cy.url().should("eq", "http://localhost:3000/products/history/buy");
  });

  it("상품관리 페이지 요소들이 노출되어야 한다", () => {
    cy.visit("http://localhost:3000/products/manage");
    cy.contains("사진");
    cy.contains("판매상태");
    cy.contains("상품명");
    cy.contains("가격");
    cy.contains("등록시간");
    cy.contains("기능");
  });
  it("판매내역 페이지 요소들이 노출되어야 한다", () => {
    cy.visit("http://localhost:3000/products/history/sell");
    cy.contains("사진");
    cy.contains("상품명");
    cy.contains("가격");
  });
  it("구매내역 페이지 요소들이 노출되어야 한다", () => {
    cy.visit("http://localhost:3000/products/history/buy");
    cy.contains("사진");
    cy.contains("상품명");
    cy.contains("가격");
    cy.contains("기능");
  });
});
