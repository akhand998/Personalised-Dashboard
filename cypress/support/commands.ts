/// <reference types="cypress" />

// Custom command to login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/signin')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
  cy.url().should('include', '/dashboard')
})

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/auth/signin')
})

// Custom command to toggle dark mode
Cypress.Commands.add('toggleDarkMode', () => {
  cy.get('[data-testid="dark-mode-toggle"]').click()
})

// Custom command to search
Cypress.Commands.add('search', (query: string) => {
  cy.get('[data-testid="search-input"]').type(query)
  cy.get('[data-testid="search-button"]').click()
})

// Custom command to add to favorites
Cypress.Commands.add('addToFavorites', (itemId: string) => {
  cy.get(`[data-testid="favorite-button-${itemId}"]`).click()
})

// Custom command to remove from favorites
Cypress.Commands.add('removeFromFavorites', (itemId: string) => {
  cy.get(`[data-testid="remove-favorite-button-${itemId}"]`).click()
})

// Custom command to drag and drop
Cypress.Commands.add('dragAndDrop', (subject: string, target: string) => {
  cy.get(subject).trigger('mousedown', { button: 0 })
  cy.get(target).trigger('mousemove').trigger('mouseup', { force: true })
})

// Custom command to select category
Cypress.Commands.add('selectCategory', (category: string) => {
  cy.get(`[data-testid="category-${category}"]`).click()
})

// Custom command to wait for content to load
Cypress.Commands.add('waitForContent', () => {
  cy.get('[data-testid="loading-spinner"]').should('not.exist')
  cy.get('[data-testid="content-container"]').should('be.visible')
})

// Custom command to check if element is visible
Cypress.Commands.add('isVisible', (selector: string) => {
  cy.get(selector).should('be.visible')
})

// Custom command to check if element is hidden
Cypress.Commands.add('isHidden', (selector: string) => {
  cy.get(selector).should('not.be.visible')
})

// Custom command to check localStorage
Cypress.Commands.add('checkLocalStorage', (key: string, value: string) => {
  cy.window().its('localStorage').invoke('getItem', key).should('eq', value)
})

// Custom command to set localStorage
Cypress.Commands.add('setLocalStorage', (key: string, value: string) => {
  cy.window().its('localStorage').invoke('setItem', key, value)
})

// Custom command to clear localStorage
Cypress.Commands.add('clearLocalStorage', () => {
  cy.window().its('localStorage').invoke('clear')
})

// Custom command to check sessionStorage
Cypress.Commands.add('checkSessionStorage', (key: string, value: string) => {
  cy.window().its('sessionStorage').invoke('getItem', key).should('eq', value)
})

// Custom command to set sessionStorage
Cypress.Commands.add('setSessionStorage', (key: string, value: string) => {
  cy.window().its('sessionStorage').invoke('setItem', key, value)
})

// Custom command to clear sessionStorage
Cypress.Commands.add('clearSessionStorage', () => {
  cy.window().its('sessionStorage').invoke('clear')
})

// Extend Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
      toggleDarkMode(): Chainable<void>
      search(query: string): Chainable<void>
      addToFavorites(itemId: string): Chainable<void>
      removeFromFavorites(itemId: string): Chainable<void>
      dragAndDrop(subject: string, target: string): Chainable<void>
      selectCategory(category: string): Chainable<void>
      waitForContent(): Chainable<void>
      isVisible(selector: string): Chainable<void>
      isHidden(selector: string): Chainable<void>
      checkLocalStorage(key: string, value: string): Chainable<void>
      setLocalStorage(key: string, value: string): Chainable<void>
      clearLocalStorage(): Chainable<void>
      checkSessionStorage(key: string, value: string): Chainable<void>
      setSessionStorage(key: string, value: string): Chainable<void>
      clearSessionStorage(): Chainable<void>
    }
  }
} 