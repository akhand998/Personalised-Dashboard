describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Mock authentication and visit dashboard
    cy.intercept('GET', '/api/auth/session', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getSession')

    cy.visit('/dashboard')
    cy.wait('@getSession')
  })

  it('should display dashboard with all main sections', () => {
    cy.get('[data-testid="dashboard-layout"]').should('be.visible')
    cy.get('[data-testid="news-feed"]').should('be.visible')
    cy.get('[data-testid="movies-feed"]').should('be.visible')
    cy.get('[data-testid="preferences-panel"]').should('be.visible')
  })

  it('should handle search functionality', () => {
    // Mock search API response
    cy.intercept('GET', '/api/search*', {
      statusCode: 200,
      body: {
        results: [
          {
            id: '1',
            title: 'Search Result 1',
            type: 'news',
            description: 'Search result description'
          }
        ]
      }
    }).as('searchRequest')

    cy.get('[data-testid="search-input"]').type('test search')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@searchRequest')
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.get('[data-testid="search-result-1"]').should('contain', 'Search Result 1')
  })

  it('should handle drag and drop reordering', () => {
    // Mock content API response
    cy.intercept('GET', '/api/news*', {
      statusCode: 200,
      body: {
        articles: [
          { id: '1', title: 'Article 1' },
          { id: '2', title: 'Article 2' },
          { id: '3', title: 'Article 3' }
        ]
      }
    }).as('getNews')

    cy.wait('@getNews')

    // Test drag and drop
    cy.get('[data-testid="draggable-item-1"]').trigger('mousedown', { button: 0 })
    cy.get('[data-testid="drop-zone"]').trigger('mousemove').trigger('mouseup', { force: true })

    // Verify reordering was handled
    cy.get('[data-testid="reorder-success"]').should('be.visible')
  })

  it('should handle category selection', () => {
    // Mock category API response
    cy.intercept('GET', '/api/news?category=technology', {
      statusCode: 200,
      body: {
        articles: [
          { id: '1', title: 'Tech Article 1' },
          { id: '2', title: 'Tech Article 2' }
        ]
      }
    }).as('getTechNews')

    cy.get('[data-testid="category-technology"]').click()
    cy.wait('@getTechNews')

    cy.get('[data-testid="news-feed"]').should('contain', 'Tech Article 1')
    cy.get('[data-testid="news-feed"]').should('contain', 'Tech Article 2')
  })

  it('should handle dark mode toggle', () => {
    cy.get('[data-testid="dark-mode-toggle"]').click()
    
    // Verify dark mode is applied
    cy.get('body').should('have.class', 'dark')
    cy.checkLocalStorage('darkMode', 'true')

    cy.get('[data-testid="dark-mode-toggle"]').click()
    
    // Verify light mode is applied
    cy.get('body').should('not.have.class', 'dark')
    cy.checkLocalStorage('darkMode', 'false')
  })

  it('should handle adding items to favorites', () => {
    // Mock favorites API
    cy.intercept('POST', '/api/favorites', {
      statusCode: 200,
      body: { success: true }
    }).as('addFavorite')

    cy.get('[data-testid="favorite-button-1"]').click()
    cy.wait('@addFavorite')

    cy.get('[data-testid="favorite-button-1"]').should('have.class', 'favorited')
    cy.get('[data-testid="favorites-count"]').should('contain', '1')
  })

  it('should handle removing items from favorites', () => {
    // Mock remove favorite API
    cy.intercept('DELETE', '/api/favorites/1', {
      statusCode: 200,
      body: { success: true }
    }).as('removeFavorite')

    cy.get('[data-testid="remove-favorite-button-1"]').click()
    cy.wait('@removeFavorite')

    cy.get('[data-testid="remove-favorite-button-1"]').should('not.exist')
    cy.get('[data-testid="favorites-count"]').should('contain', '0')
  })

  it('should handle user preferences', () => {
    // Mock preferences API
    cy.intercept('PUT', '/api/preferences', {
      statusCode: 200,
      body: { success: true }
    }).as('updatePreferences')

    cy.get('[data-testid="preferences-panel"]').click()
    cy.get('[data-testid="category-checkbox-sports"]').check()
    cy.get('[data-testid="save-preferences"]').click()

    cy.wait('@updatePreferences')
    cy.get('[data-testid="preferences-saved"]').should('be.visible')
  })

  it('should handle responsive layout', () => {
    // Test mobile view
    cy.viewport(375, 667)
    cy.get('[data-testid="mobile-menu-button"]').click()
    cy.get('[data-testid="mobile-menu"]').should('be.visible')

    // Test tablet view
    cy.viewport(768, 1024)
    cy.get('[data-testid="mobile-menu"]').should('not.be.visible')

    // Test desktop view
    cy.viewport(1280, 720)
    cy.get('[data-testid="sidebar"]').should('be.visible')
  })

  it('should handle loading states', () => {
    // Mock slow API response
    cy.intercept('GET', '/api/news*', {
      statusCode: 200,
      body: { articles: [] },
      delay: 2000
    }).as('slowNewsRequest')

    cy.visit('/dashboard')
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.wait('@slowNewsRequest')
    cy.get('[data-testid="loading-spinner"]').should('not.exist')
  })

  it('should handle error states', () => {
    // Mock API error
    cy.intercept('GET', '/api/news*', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('newsError')

    cy.visit('/dashboard')
    cy.wait('@newsError')
    cy.get('[data-testid="error-message"]').should('contain', 'Failed to load content')
  })

  it('should handle empty content states', () => {
    // Mock empty response
    cy.intercept('GET', '/api/news*', {
      statusCode: 200,
      body: { articles: [] }
    }).as('emptyNews')

    cy.visit('/dashboard')
    cy.wait('@emptyNews')
    cy.get('[data-testid="empty-state"]').should('be.visible')
    cy.get('[data-testid="empty-state"]').should('contain', 'No content available')
  })

  it('should handle real-time updates', () => {
    // Mock WebSocket connection
    cy.intercept('GET', '/api/ws', {
      statusCode: 101,
      body: {}
    }).as('websocket')

    cy.get('[data-testid="realtime-toggle"]').click()
    cy.wait('@websocket')

    // Mock real-time update
    cy.get('[data-testid="realtime-indicator"]').should('be.visible')
  })

  it('should handle keyboard navigation', () => {
    cy.get('body').type('{ctrl}k') // Open search
    cy.get('[data-testid="search-input"]').should('be.focused')

    cy.get('body').type('{escape}') // Close search
    cy.get('[data-testid="search-input"]').should('not.be.visible')

    cy.get('body').type('{ctrl}m') // Toggle dark mode
    cy.get('body').should('have.class', 'dark')
  })

  it('should handle accessibility features', () => {
    // Test screen reader support
    cy.get('[data-testid="news-feed"]').should('have.attr', 'aria-label')
    cy.get('[data-testid="search-input"]').should('have.attr', 'aria-describedby')

    // Test keyboard navigation
    cy.get('[data-testid="category-technology"]').focus()
    cy.get('[data-testid="category-technology"]').should('have.focus')
  })

  it('should persist user preferences', () => {
    // Set preferences
    cy.setLocalStorage('userPreferences', JSON.stringify({
      categories: ['technology', 'sports'],
      darkMode: true,
      favorites: ['1', '2']
    }))

    cy.reload()

    // Verify preferences are restored
    cy.checkLocalStorage('userPreferences').then((prefs) => {
      const preferences = JSON.parse(prefs)
      expect(preferences.categories).to.include('technology')
      expect(preferences.darkMode).to.be.true
    })
  })
}) 