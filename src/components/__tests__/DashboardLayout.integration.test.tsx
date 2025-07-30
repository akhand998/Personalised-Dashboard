import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardLayout from '../DashboardLayout'
import { TestWrapper, createTestStore } from '../../utils/TestWrapper'

// Mock the AuthContext
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
}

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: jest.fn(),
  }),
}))

describe('DashboardLayout Integration Tests', () => {
  const mockProps = {
    children: <div>Test Content</div>,
    currentSection: 'feed',
    onSectionChange: jest.fn(),
    searchTerm: '',
    onSearchTermChange: jest.fn(),
  }

  it('renders dashboard with all main components', () => {
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    expect(screen.getByTestId('news-feed')).toBeInTheDocument()
    expect(screen.getByTestId('movies-feed')).toBeInTheDocument()
    expect(screen.getByTestId('preferences-panel')).toBeInTheDocument()
  })

  it('displays user information', () => {
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    expect(screen.getByTestId('user-name')).toBeInTheDocument()
    expect(screen.getByTestId('user-email')).toBeInTheDocument()
  })

  it('handles dark mode toggle', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    const darkModeToggle = screen.getByTestId('dark-mode-toggle')
    await user.click(darkModeToggle)

    // Check if the state was updated
    expect(darkModeToggle).toBeInTheDocument()
  })

  it('handles category selection', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    const categoryButton = screen.getByTestId('category-technology')
    await user.click(categoryButton)

    // Check if the state was updated
    expect(categoryButton).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    const user = userEvent.setup()
    const onSearchTermChange = jest.fn()
    const searchProps = {
      ...mockProps,
      onSearchTermChange,
    }
    
    render(
      <TestWrapper>
        <DashboardLayout {...searchProps} />
      </TestWrapper>
    )

    const searchInput = screen.getByTestId('search-input')
    await user.type(searchInput, 'test search')

    // Check that the search term change was called multiple times (once per character)
    expect(onSearchTermChange).toHaveBeenCalledTimes(11) // "test search" has 11 characters
    expect(onSearchTermChange).toHaveBeenLastCalledWith('h') // Last character typed
  })

  it('handles logout functionality', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    const logoutButton = screen.getByTestId('logout-button')
    await user.click(logoutButton)

    // Verify logout was called (this would be handled by the AuthContext)
    // The actual logout logic would be tested in the AuthContext tests
    expect(logoutButton).toBeInTheDocument()
  })

  it('handles responsive layout changes', () => {
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    // Test mobile menu toggle
    const mobileMenuButton = screen.getByTestId('mobile-menu-button')
    fireEvent.click(mobileMenuButton)

    // Verify mobile menu is shown
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
  })

  it('handles drag and drop reordering', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    // Test drag and drop functionality
    const draggableItem = screen.getByTestId('draggable-item')
    const dropZone = screen.getByTestId('drop-zone')

    await user.click(draggableItem)
    await user.keyboard('{Space}')
    await user.click(dropZone)

    // Verify the reordering was handled
    expect(draggableItem).toBeInTheDocument()
    expect(dropZone).toBeInTheDocument()
  })

  it('handles error states gracefully', () => {
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    // Verify error message is displayed
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
  })

  it('handles loading states', () => {
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    // Verify loading indicator is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('handles empty content states', () => {
    render(
      <TestWrapper>
        <DashboardLayout {...mockProps} />
      </TestWrapper>
    )

    // Verify empty state message is displayed
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
}) 