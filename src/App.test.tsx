import { render, screen } from '@testing-library/react'
import App from './App'

test('renders sign in page title', () => {
  render(<App />)
  const titleElement = screen.getByText(/entrar/i)
  expect(titleElement).toBeInTheDocument()
})
