# Testing Documentation

This document outlines the comprehensive testing setup for the Personalised Dashboard project, covering unit tests, integration tests, and E2E tests as specified in the requirements.

## Testing Overview

The project implements a complete testing strategy with three main types of tests:

1. **Unit Tests** - Testing individual components and functions in isolation
2. **Integration Tests** - Testing component interactions and state management
3. **E2E Tests** - Testing complete user flows and critical functionality

## Test Structure

```
├── src/
│   ├── components/__tests__/
│   │   ├── LoginForm.test.tsx          # Unit tests for login form
│   │   └── DashboardLayout.integration.test.tsx  # Integration tests
│   ├── store/__tests__/
│   │   └── preferencesSlice.test.ts    # Redux slice unit tests
│   └── features/contentFeed/__tests__/
│       └── newsSlice.test.ts           # Async thunk tests
├── cypress/
│   ├── e2e/
│   │   ├── auth.cy.ts                  # Authentication E2E tests
│   │   └── dashboard.cy.ts             # Dashboard E2E tests
│   ├── fixtures/
│   │   ├── news.json                   # Test data for news
│   │   └── movies.json                 # Test data for movies
│   └── support/
│       ├── commands.ts                 # Custom Cypress commands
│       └── e2e.ts                     # Global test configuration
├── jest.config.js                      # Jest configuration
├── jest.setup.js                       # Jest setup and mocks
└── cypress.config.ts                   # Cypress configuration
```

## Test Types

### 1. Unit Tests

Unit tests focus on testing individual components and functions in isolation.

#### Component Unit Tests
- **LoginForm.test.tsx**: Tests form validation, user interactions, and authentication flows
- Tests include:
  - Form rendering and validation
  - Login/register mode switching
  - Error handling and loading states
  - Email format validation
  - Required field validation

#### Redux Unit Tests
- **preferencesSlice.test.ts**: Tests Redux state management for user preferences
- Tests include:
  - Initial state validation
  - Action creators and reducers
  - State transitions (dark mode, categories, favorites)
  - Edge cases and error handling

#### Async Logic Tests
- **newsSlice.test.ts**: Tests async thunk actions and API integration
- Tests include:
  - Loading, success, and error states
  - API response handling
  - State transitions
  - Error message handling

### 2. Integration Tests

Integration tests verify that components work together correctly and handle state management properly.

#### Dashboard Integration Tests
- **DashboardLayout.integration.test.tsx**: Tests component interactions and user flows
- Tests include:
  - Component rendering and layout
  - User interaction flows
  - State management integration
  - Error state handling
  - Loading state management
  - Responsive design testing

### 3. E2E Tests

End-to-end tests verify complete user flows and critical functionality.

#### Authentication E2E Tests
- **auth.cy.ts**: Tests complete authentication flows
- Tests include:
  - Login and registration flows
  - Form validation and error handling
  - Session persistence
  - Network error handling
  - Loading states during authentication

#### Dashboard E2E Tests
- **dashboard.cy.ts**: Tests complete dashboard functionality
- Tests include:
  - Search functionality
  - Drag and drop reordering
  - Category selection
  - Dark mode toggle
  - Favorites management
  - User preferences
  - Responsive layout
  - Loading and error states
  - Real-time updates
  - Keyboard navigation
  - Accessibility features

## Test Configuration

### Jest Configuration
- **jest.config.js**: Configured for Next.js with TypeScript support
- **jest.setup.js**: Global test setup including mocks for:
  - Next.js router and navigation
  - localStorage and sessionStorage
  - IntersectionObserver and ResizeObserver
  - DOM APIs

### Cypress Configuration
- **cypress.config.ts**: Configured for E2E and component testing
- Custom commands for common operations
- Global test setup with API mocking
- Error handling for common issues

## Running Tests

### Unit and Integration Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Open Cypress test runner
npm run test:e2e:open
```

### All Tests
```bash
# Run all tests (unit + E2E)
npm run test:all
```

## Test Coverage

The testing suite provides comprehensive coverage for:

### Edge Cases
- Empty content states
- Network errors and timeouts
- Invalid user input
- API failures
- Loading states

### User Interactions
- Form submissions and validation
- Button clicks and navigation
- Keyboard shortcuts
- Drag and drop operations
- Responsive design interactions

### State Management
- Redux state transitions
- Local storage persistence
- Session management
- User preferences

### Accessibility
- Screen reader support
- Keyboard navigation
- ARIA attributes
- Focus management

## Custom Test Utilities

### Cypress Commands
- `cy.login(email, password)` - Login helper
- `cy.logout()` - Logout helper
- `cy.toggleDarkMode()` - Dark mode toggle
- `cy.search(query)` - Search functionality
- `cy.addToFavorites(itemId)` - Add to favorites
- `cy.removeFromFavorites(itemId)` - Remove from favorites
- `cy.dragAndDrop(subject, target)` - Drag and drop
- `cy.selectCategory(category)` - Category selection
- `cy.waitForContent()` - Wait for content to load
- `cy.checkLocalStorage(key, value)` - Check localStorage
- `cy.setLocalStorage(key, value)` - Set localStorage

### Jest Mocks
- Next.js router and navigation
- Authentication context
- API responses
- Browser APIs (localStorage, sessionStorage)
- DOM observers (IntersectionObserver, ResizeObserver)

## Test Data

### Fixtures
- **news.json**: Sample news articles for testing
- **movies.json**: Sample movie data for testing

### Mock Data
- User authentication data
- API response structures
- Error scenarios
- Loading states

## Best Practices

### Unit Tests
- Test individual functions and components in isolation
- Mock external dependencies
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused and atomic

### Integration Tests
- Test component interactions
- Verify state management
- Test user flows
- Mock API calls appropriately
- Test error handling

### E2E Tests
- Test complete user journeys
- Use realistic test data
- Test critical functionality
- Handle async operations properly
- Test responsive design

## Continuous Integration

The testing setup is designed to work with CI/CD pipelines:

1. **Unit and Integration Tests**: Fast feedback on code changes
2. **E2E Tests**: Verify complete functionality
3. **Coverage Reports**: Track test coverage
4. **Parallel Execution**: Optimize test execution time

## Future Enhancements

### Additional Test Types
- **Visual Regression Tests**: Using tools like Percy or Chromatic
- **Performance Tests**: Using tools like Lighthouse CI
- **Security Tests**: Using tools like OWASP ZAP

### Test Improvements
- **API Contract Tests**: Using tools like Pact
- **Mutation Testing**: Using tools like Stryker
- **Accessibility Testing**: Using tools like axe-core

## Troubleshooting

### Common Issues
1. **Test Environment**: Ensure all dependencies are installed
2. **Mock Setup**: Verify mocks are properly configured
3. **Async Operations**: Use proper wait conditions
4. **Test Data**: Ensure fixtures are up to date

### Debugging
- Use `console.log` in tests for debugging
- Use Cypress debug mode for E2E tests
- Check test coverage reports
- Review test output for detailed error messages

This comprehensive testing setup ensures the application is robust, reliable, and maintainable while providing confidence in code changes and new features. 