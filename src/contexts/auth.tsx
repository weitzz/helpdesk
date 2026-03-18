import { createContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { auth, database } from '../services/firebaseConnection'
import type { AuthContextData, AuthProviderProps, UserData } from '../types'

const defaultAuthContext: AuthContextData = {
  signed: false,
  user: null,
  loading: true,
  loadingAuth: false,
  signIn: async () => { },
  signUp: async () => { },
  resetPassword: async () => { },
  logout: async () => { },
  setUser: () => null,
  storageUser: () => { }
}

export const AuthContext = createContext<AuthContextData>(defaultAuthContext)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storageUser = localStorage.getItem('SistemaUser')

    if (storageUser) {
      setUser(JSON.parse(storageUser) as UserData)
    }

    setLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    setLoadingAuth(true)

    try {
      const value = await signInWithEmailAndPassword(auth, email, password)
      const uid = value.user.uid
      const userProfile = doc(database, 'users', uid)
      const docSnap = await getDoc(userProfile)
      const profileData = docSnap.data()

      const data: UserData = {
        uid,
        name: typeof profileData?.name === 'string' ? profileData.name : '',
        email: value.user.email,
        avatarUrl: typeof profileData?.avatarUrl === 'string' ? profileData.avatarUrl : null
      }

      setUser(data)
      storageUser(data)
      toast.success('Bem vindo(a) de volta!')
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      toast.error('Algo deu errado!')
    } finally {
      setLoadingAuth(false)
    }
  }

  async function signUp(email: string, password: string, name: string) {
    setLoadingAuth(true)

    try {
      const value = await createUserWithEmailAndPassword(auth, email, password)
      const uid = value.user.uid

      await setDoc(doc(database, 'users', uid), {
        name,
        avatarUrl: null
      })

      const data: UserData = {
        uid,
        name,
        email: value.user.email,
        avatarUrl: null
      }

      setUser(data)
      storageUser(data)
      navigate('/dashboard')
      toast.success('Cadastrado com sucesso, seja bem vindo(a)!')
    } catch (error) {
      toast.error('Algo deu errado!')
      console.log(error)
    } finally {
      setLoadingAuth(false)
    }
  }

  async function resetPassword(email: string) {
    setLoadingAuth(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Enviamos o link de recuperacao para o seu email.')
    } catch (error) {
      toast.error('Nao foi possivel enviar o email de recuperacao.')
      console.log(error)
    } finally {
      setLoadingAuth(false)
    }
  }

  function storageUser(data: UserData) {
    localStorage.setItem('SistemaUser', JSON.stringify(data))
  }

  async function logout() {
    await signOut(auth)
    localStorage.removeItem('SistemaUser')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        logout,
        loading,
        signUp,
        signIn,
        resetPassword,
        loadingAuth,
        setUser,
        storageUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
