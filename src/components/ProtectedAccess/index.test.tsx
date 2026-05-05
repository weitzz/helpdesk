import { render, screen } from '@testing-library/react'
import { AuthContext } from '../../contexts/auth'
import { ProtectedByPermission, ProtectedByRole } from './index'
import type { AuthContextData, UserData } from '../../types'

jest.mock('../../contexts/auth', () => {
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

function createAuthValue(user: UserData | null): AuthContextData {
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
    storageUser: () => {}
  }
}

describe('ProtectedAccess', () => {
  it('renderiza o conteudo quando o role esta permitido', () => {
    render(
      <AuthContext.Provider
        value={createAuthValue({
          uid: '1',
          name: 'Admin',
          email: 'admin@mail.com',
          avatarUrl: null,
          role: 'admin'
        })}
      >
        <ProtectedByRole roles={['admin', 'tecnico']}>
          <span>Painel liberado</span>
        </ProtectedByRole>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Painel liberado')).toBeInTheDocument()
  })

  it('renderiza fallback quando o role nao esta permitido', () => {
    render(
      <AuthContext.Provider
        value={createAuthValue({
          uid: '2',
          name: 'Cliente',
          email: 'cliente@mail.com',
          avatarUrl: null,
          role: 'cliente'
        })}
      >
        <ProtectedByRole roles={['admin']} fallback={<span>Sem acesso</span>}>
          <span>Painel liberado</span>
        </ProtectedByRole>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Sem acesso')).toBeInTheDocument()
    expect(screen.queryByText('Painel liberado')).not.toBeInTheDocument()
  })

  it('renderiza o conteudo quando a permissao esta liberada', () => {
    render(
      <AuthContext.Provider
        value={createAuthValue({
          uid: '3',
          name: 'Admin',
          email: 'admin@mail.com',
          avatarUrl: null,
          role: 'admin'
        })}
      >
        <ProtectedByPermission permission="canManageUsers">
          <span>Gestao de usuarios</span>
        </ProtectedByPermission>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Gestao de usuarios')).toBeInTheDocument()
  })

  it('renderiza fallback quando a permissao nao esta liberada', () => {
    render(
      <AuthContext.Provider
        value={createAuthValue({
          uid: '4',
          name: 'Cliente',
          email: 'cliente@mail.com',
          avatarUrl: null,
          role: 'cliente'
        })}
      >
        <ProtectedByPermission permission="canManageUsers" fallback={<span>Bloqueado</span>}>
          <span>Gestao de usuarios</span>
        </ProtectedByPermission>
      </AuthContext.Provider>
    )

    expect(screen.getByText('Bloqueado')).toBeInTheDocument()
    expect(screen.queryByText('Gestao de usuarios')).not.toBeInTheDocument()
  })
})
