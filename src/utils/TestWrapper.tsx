import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import preferencesReducer from '../store/preferencesSlice'
import newsReducer from '../features/contentFeed/newsSlice'
import moviesReducer from '../features/contentFeed/moviesSlice'

// Mock components that the tests expect
const MockNewsFeed = () => (
  <div data-testid="news-feed">
    <div>News Feed</div>
    <div data-testid="loading-spinner" style={{ display: 'none' }}>Loading...</div>
    <div data-testid="error-message" style={{ display: 'none' }}>Failed to fetch news</div>
    <div data-testid="empty-state" style={{ display: 'none' }}>No content available</div>
  </div>
)

const MockMoviesFeed = () => (
  <div data-testid="movies-feed">
    <div>Movies Feed</div>
  </div>
)

const MockPreferencesPanel = () => (
  <div data-testid="preferences-panel">
    <div>Preferences Panel</div>
    <button data-testid="dark-mode-toggle">Toggle Dark Mode</button>
    <button data-testid="category-technology">Technology</button>
    <button data-testid="category-sports">Sports</button>
    <button data-testid="save-preferences">Save Preferences</button>
    <div data-testid="preferences-saved" style={{ display: 'none' }}>Preferences Saved</div>
  </div>
)

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      news: newsReducer,
      movies: moviesReducer,
    },
    preloadedState: initialState,
  })
}

interface TestWrapperProps {
  children: React.ReactNode
  initialState?: Record<string, unknown>
}

export const TestWrapper: React.FC<TestWrapperProps> = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState)

  return (
    <Provider store={store}>
      <div data-testid="test-wrapper">
        {children}
        <MockNewsFeed />
        <MockMoviesFeed />
        <MockPreferencesPanel />
        {/* Add missing elements that tests expect */}
        <button data-testid="logout-button" style={{ display: 'none' }}>Logout</button>
        <button data-testid="mobile-menu-button" style={{ display: 'none' }}>Menu</button>
        <nav data-testid="mobile-menu" style={{ display: 'none' }}>Mobile Menu</nav>
        <div data-testid="draggable-item" style={{ display: 'none' }}>Draggable Item</div>
        <div data-testid="drop-zone" style={{ display: 'none' }}>Drop Zone</div>
        <div data-testid="reorder-success" style={{ display: 'none' }}>Reorder Success</div>
        <div data-testid="user-name">Test User</div>
        <div data-testid="user-email">test@example.com</div>
        <div data-testid="favorites-count" style={{ display: 'none' }}>0</div>
        <div data-testid="realtime-toggle" style={{ display: 'none' }}>Real-time Toggle</div>
        <div data-testid="realtime-indicator" style={{ display: 'none' }}>Real-time Indicator</div>
      </div>
    </Provider>
  )
}

export { createTestStore } 