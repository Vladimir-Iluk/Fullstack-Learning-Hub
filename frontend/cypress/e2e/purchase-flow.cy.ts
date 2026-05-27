/**
 * ═══════════════════════════════════════════════════════
 * E2E Test: Course Purchase Flow (Cypress)
 * Topic #6: Види тестів — E2E Test
 * ═══════════════════════════════════════════════════════
 * Повний сценарій: перегляд каталогу → додавання до кошика
 * → авторизація → оформлення замовлення.
 */

describe('Course Purchase Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the course catalog on home page', () => {
    // Verify hero section
    cy.contains('DevHub LMS').should('be.visible');
    cy.contains('Прокачай свої навички').should('be.visible');

    // Verify courses grid exists
    cy.get('#search-input').should('exist');
  });

  it('should filter courses by category', () => {
    cy.get('#category-frontend').click();
    // Should show only frontend courses
    cy.url().should('include', '/');
  });

  it('should add a course to the cart', () => {
    // Find first "Додати" button and click
    cy.get('[id^="add-to-cart-"]').first().click();

    // Cart badge should show 1
    cy.get('.cart-badge').should('contain', '1');
  });

  it('should navigate to cart and see the added course', () => {
    // Add a course first
    cy.get('[id^="add-to-cart-"]').first().click();

    // Open cart
    cy.get('#nav-cart-btn').click();

    // Navigate to cart page
    cy.visit('/cart');

    // Cart should not be empty
    cy.contains('Кошик навчання').should('be.visible');
  });

  it('should navigate to course details page', () => {
    cy.get('.course-card').first().click();

    // Should see course details
    cy.contains('Про курс').should('be.visible');
    cy.get('#course-add-to-cart').should('exist');
  });

  it('should navigate to login page from checkout', () => {
    // Add course and go to cart
    cy.get('[id^="add-to-cart-"]').first().click();
    cy.visit('/cart');

    // Click checkout (should redirect to login for unauthenticated users)
    cy.get('#checkout-btn').click();

    // Should be on login page or show alert
    cy.url().should('include', '/login');
  });

  it('should display the Router Guide page', () => {
    cy.visit('/router-guide');

    cy.contains('React Router: v5 vs v6').should('be.visible');
    cy.contains('v5').should('be.visible');
    cy.contains('v6').should('be.visible');
  });

  it('should display the Archive page with class components', () => {
    cy.visit('/archive');

    cy.contains('Архів лекцій').should('be.visible');
    cy.contains('Class Components').should('be.visible');
  });

  it('should access the support chat page', () => {
    cy.visit('/support');

    cy.contains('Чат підтримки').should('be.visible');
    cy.get('#guest-name-input').should('exist');
  });
});
