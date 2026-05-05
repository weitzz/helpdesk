import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import App from './App'

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: ReactNode }) => <>{children}</>
}))

jest.mock('./contexts/auth', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>
}))

jest.mock('./routes', () => ({
  __esModule: true,
  default: () => <h1>Entrar</h1>
}))

jest.mock('react-toastify', () => ({
  ToastContainer: () => null
}))

test('renders sign in page title', () => {
  render(<App />)
  const titleElement = screen.getByText(/entrar/i)
  expect(titleElement).toBeInTheDocument()
})
