import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../LoginForm'

// Mock the AuthContext
const mockLogin = jest.fn()
const mockRegister = jest.fn()

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form by default', () => {
    render(<LoginForm />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('switches to register mode when toggle is clicked', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    
    const toggleButton = screen.getByTestId('register-toggle')
    await user.click(toggleButton)
    
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByTestId('register-button')).toBeInTheDocument()
  })

  it('handles form submission for login', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValue(undefined)
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('handles form submission for register', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValue(undefined)
    
    render(<LoginForm />)
    
    // Switch to register mode
    const toggleButton = screen.getByTestId('register-toggle')
    await user.click(toggleButton)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByTestId('register-button')
    
    await user.type(emailInput, 'new@example.com')
    await user.type(passwordInput, 'newpassword123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('new@example.com', 'newpassword123')
    })
  })

  it('displays error message when login fails', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Invalid credentials'
    mockLogin.mockRejectedValue(new Error(errorMessage))
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(screen.getByText('Signing In...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // HTML5 validation should prevent submission
    expect(mockLogin).not.toHaveBeenCalled()
  })
}) 