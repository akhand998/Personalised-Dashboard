describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/auth/signin')
  })

  it('should display login form by default', () => {
    cy.get('[data-testid="login-form"]').should('be.visible')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
  })

  it('should switch to register mode when toggle is clicked', () => {
    cy.get('[data-testid="register-toggle"]').click()
    cy.get('[data-testid="register-form"]').should('be.visible')
    cy.get('[data-testid="register-button"]').should('be.visible')
  })

  it('should handle successful login', () => {
    // Mock successful login response
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('loginRequest')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="user-name"]').should('contain', 'Test User')
  })

  it('should handle failed login', () => {
    // Mock failed login response
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 401,
      body: {
        error: 'Invalid credentials'
      }
    }).as('loginRequest')

    cy.get('[data-testid="email-input"]').type('wrong@example.com')
    cy.get('[data-testid="password-input"]').type('wrongpassword')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginRequest')
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials')
    cy.url().should('include', '/auth/signin')
  })

  it('should handle successful registration', () => {
    // Mock successful registration response
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 201,
      body: {
        user: {
          id: '1',
          email: 'new@example.com',
          name: 'New User'
        }
      }
    }).as('registerRequest')

    cy.get('[data-testid="register-toggle"]').click()
    cy.get('[data-testid="email-input"]').type('new@example.com')
    cy.get('[data-testid="password-input"]').type('newpassword123')
    cy.get('[data-testid="register-button"]').click()

    cy.wait('@registerRequest')
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="user-name"]').should('contain', 'New User')
  })

  it('should handle failed registration', () => {
    // Mock failed registration response
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 400,
      body: {
        error: 'Email already exists'
      }
    }).as('registerRequest')

    cy.get('[data-testid="register-toggle"]').click()
    cy.get('[data-testid="email-input"]').type('existing@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="register-button"]').click()

    cy.wait('@registerRequest')
    cy.get('[data-testid="error-message"]').should('contain', 'Email already exists')
    cy.url().should('include', '/auth/signin')
  })

  it('should validate required fields', () => {
    cy.get('[data-testid="login-button"]').click()
    
    // Check for HTML5 validation messages
    cy.get('[data-testid="email-input"]').should('have.attr', 'required')
    cy.get('[data-testid="password-input"]').should('have.attr', 'required')
  })

  it('should validate email format', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    // Check for email validation
    cy.get('[data-testid="email-input"]').should('have.attr', 'type', 'email')
  })

  it('should show loading state during authentication', () => {
    // Mock slow response
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: { user: { id: '1', email: 'test@example.com' } },
      delay: 1000
    }).as('slowLoginRequest')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should handle logout', () => {
    // First login
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('loginRequest')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Then logout
    cy.intercept('POST', '/api/auth/signout', {
      statusCode: 200,
      body: {}
    }).as('logoutRequest')

    cy.get('[data-testid="logout-button"]').click()
    cy.wait('@logoutRequest')
    cy.url().should('include', '/auth/signin')
  })

  it('should persist authentication state', () => {
    // Mock successful login
    cy.intercept('POST', '/api/auth/signin', {
      statusCode: 200,
      body: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('loginRequest')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginRequest')
    cy.url().should('include', '/dashboard')

    // Refresh page
    cy.reload()
    
    // Should still be logged in
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="user-name"]').should('contain', 'Test User')
  })

  it('should handle network errors gracefully', () => {
    // Mock network error
    cy.intercept('POST', '/api/auth/signin', {
      forceNetworkError: true
    }).as('networkError')

    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="error-message"]').should('contain', 'Network error')
  })
}) 