import { render, screen } from '@testing-library/react'
import { AuthContext } from '../contexts/auth'
import Private from './Private'
import type { AuthContextData, UserData } from '../types'

jest.mock('../contexts/auth', () => {
  const React = require('react')

  return {
    AuthContext: React.createContext({
      signed: false,
      user: null,
      loading: false,
      loadingAuth: false,
      signIn: async () => {},
      signUp: async () => {},
      resetPassword: async () => {},
      logout: async () => {},
      setUser: () => null,
      storageUser: () => {}
    })
  }
})

jest.mock('react-router-dom', () => {
  const React = require('react')

  return {
    Navigate: ({ to }: { to: string }) => <div>Navigate:{to}</div>
  }
})

function createAuthValue(user: UserData | null, overrides?: Partial<AuthContextData>): AuthContextData {
  return {
    signed: !!user,
    user,
    loading: false,
    loadingAuth: false,
    signIn: async () => {},
    signUp: async () => {},
    resetPassword: async () => {},
    logout: async () => {},
    setUser: () => null,
    storageUser: () => {},
    ...overrides
  }
}

function renderPrivate(value: AuthContextData) {
  return render(
    <AuthContext.Provider value={value}>
      <Private allowedRoles={['admin']}>
        <div>Area administrativa</div>
      </Private>
    </AuthContext.Provider>
  )
}

describe('Private', () => {
  it('renderiza os filhos quando o usuario esta autenticado e autorizado', () => {
    renderPrivate(
      createAuthValue({
        uid: '1',
        name: 'Admin',
        email: 'admin@mail.com',
        avatarUrl: null,
        role: 'admin'
      })
    )

    expect(screen.getByText('Area administrativa')).toBeInTheDocument()
  })

  it('redireciona usuario nao autenticado para login', () => {
    renderPrivate(createAuthValue(null, { signed: false }))

    expect(screen.getByText('Navigate:/')).toBeInTheDocument()
    expect(screen.queryByText('Area administrativa')).not.toBeInTheDocument()
  })

  it('redireciona usuario autenticado sem role permitido para dashboard', () => {
    renderPrivate(
      createAuthValue({
        uid: '2',
        name: 'Cliente',
        email: 'cliente@mail.com',
        avatarUrl: null,
        role: 'cliente'
      })
    )

    expect(screen.getByText('Navigate:/dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Area administrativa')).not.toBeInTheDocument()
  })

  it('nao renderiza conteudo protegido enquanto a autenticacao carrega', () => {
    const { container } = renderPrivate(
      createAuthValue(null, {
        loading: true,
        signed: false
      })
    )

    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Area administrativa')).not.toBeInTheDocument()
    expect(container.firstChild).toBeEmptyDOMElement()
  })
})
