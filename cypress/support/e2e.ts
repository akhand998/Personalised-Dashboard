// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global configuration
beforeEach(() => {
  // Clear localStorage and sessionStorage before each test
  cy.clearLocalStorage()
  cy.clearSessionStorage()
  
  // Mock API responses if needed
  cy.intercept('GET', '/api/news*', { fixture: 'news.json' }).as('getNews')
  cy.intercept('GET', '/api/movies*', { fixture: 'movies.json' }).as('getMovies')
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // for uncaught exceptions that are not related to the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
}) 