import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import AuthProvider, { AuthContext } from './auth'

const mockNavigate = jest.fn()
const mockSignInWithEmailAndPassword = jest.fn()
const mockCreateUserWithEmailAndPassword = jest.fn()
const mockSendPasswordResetEmail = jest.fn()
const mockSignOut = jest.fn()
const mockDoc = jest.fn()
const mockGetDoc = jest.fn()
const mockSetDoc = jest.fn()
const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUserWithEmailAndPassword(...args),
  sendPasswordResetEmail: (...args: unknown[]) => mockSendPasswordResetEmail(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignInWithEmailAndPassword(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args)
}))

jest.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args)
}))

jest.mock('../services/firebaseConnection', () => ({
  auth: { currentUser: null },
  database: {}
}))

jest.mock('react-toastify', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args)
  }
}))

function TestConsumer() {
  const { signed, user, loading, loadingAuth, signIn, signUp, resetPassword, logout } = useContext(AuthContext)

  return (
    <div>
      <span data-testid="signed">{String(signed)}</span>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="loading-auth">{String(loadingAuth)}</span>
      <span data-testid="name">{user?.name ?? 'sem-usuario'}</span>
      <span data-testid="role">{user?.role ?? 'sem-role'}</span>
      <button type="button" onClick={() => void signIn('user@mail.com', '123456')}>
        Entrar
      </button>
      <button type="button" onClick={() => void signUp('new@mail.com', '123456', 'Novo Usuario')}>
        Cadastrar
      </button>
      <button type="button" onClick={() => void resetPassword('user@mail.com')}>
        Recuperar
      </button>
      <button type="button" onClick={() => void logout()}>
        Sair
      </button>
    </div>
  )
}

function renderProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    mockDoc.mockImplementation((_database: unknown, collectionName: string, id: string) => ({
      collectionName,
      id
    }))
  })

  it('carrega usuario salvo na sessao ao iniciar', async () => {
    sessionStorage.setItem('SistemaUser', JSON.stringify({
      uid: '1',
      name: 'Usuario em sessao',
      email: 'sessao@mail.com',
      avatarUrl: null,
      role: 'tecnico'
    }))

    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('signed')).toHaveTextContent('true')
    expect(screen.getByTestId('name')).toHaveTextContent('Usuario em sessao')
    expect(screen.getByTestId('role')).toHaveTextContent('tecnico')
  })

  it('faz sign in, normaliza role invalido e persiste o usuario', async () => {
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: 'user-1',
        email: 'user@mail.com'
      }
    })
    mockGetDoc.mockResolvedValue({
      data: () => ({
        name: 'Maria',
        avatarUrl: null,
        role: 'role-invalido',
        email: 'outro@email.com'
      })
    })
    mockSetDoc.mockResolvedValue(undefined)

    renderProvider()

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByTestId('signed')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('name')).toHaveTextContent('Maria')
    expect(screen.getByTestId('role')).toHaveTextContent('cliente')
    expect(mockSetDoc).toHaveBeenCalledWith(
      { collectionName: 'users', id: 'user-1' },
      { email: 'user@mail.com' },
      { merge: true }
    )
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    expect(mockToastSuccess).toHaveBeenCalledWith('Bem vindo(a) de volta!')
    expect(JSON.parse(sessionStorage.getItem('SistemaUser') || '{}')).toMatchObject({
      uid: 'user-1',
      name: 'Maria',
      role: 'cliente'
    })
  })

  it('faz cadastro com role cliente por padrao', async () => {
    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: 'user-2',
        email: 'new@mail.com'
      }
    })
    mockSetDoc.mockResolvedValue(undefined)

    renderProvider()

    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => {
      expect(screen.getByTestId('signed')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('name')).toHaveTextContent('Novo Usuario')
    expect(screen.getByTestId('role')).toHaveTextContent('cliente')
    expect(mockSetDoc).toHaveBeenCalledWith(
      { collectionName: 'users', id: 'user-2' },
      {
        name: 'Novo Usuario',
        email: 'new@mail.com',
        avatarUrl: null,
        role: 'cliente'
      }
    )
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('envia recuperacao de senha e permite logout', async () => {
    sessionStorage.setItem('SistemaUser', JSON.stringify({
      uid: '9',
      name: 'Usuario logado',
      email: 'logado@mail.com',
      avatarUrl: null,
      role: 'cliente'
    }))
    mockSendPasswordResetEmail.mockResolvedValue(undefined)
    mockSignOut.mockResolvedValue(undefined)

    renderProvider()

    await waitFor(() => {
      expect(screen.getByTestId('signed')).toHaveTextContent('true')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Recuperar' }))

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Enviamos o link de recuperacao para o seu email.')
    })

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }))

    await waitFor(() => {
      expect(screen.getByTestId('signed')).toHaveTextContent('false')
    })

    expect(mockSignOut).toHaveBeenCalled()
    expect(sessionStorage.getItem('SistemaUser')).toBeNull()
  })
})
