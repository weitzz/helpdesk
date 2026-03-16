import { useState, useEffect, createContext } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { database, auth } from '../services/firebaseConnection'

import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({})




const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {

    const loadingStorage = () => {
      const storageUser = localStorage.getItem('SistemaUser')

      if (storageUser) {
        setUser(JSON.parse(storageUser))
        setLoading(false)
      }
      setLoading(false)
    }
    loadingStorage()
  }, [])


  //login do usuario
  async function signIn(email, password) {
    setLoadingAuth(true)

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid

        const userProfile = doc(database, "users", uid)
        const docSnap = await getDoc(userProfile)

        let data = {
          uid: uid,
          name: docSnap.data() ? docSnap.data().name : '',
          email: value.user.email,
          avatarUrl: docSnap.data() ? docSnap.data().avatarUrl : ''
        }
        console.log(data)

        setUser(data)
        storageUser(data)
        setLoadingAuth(false)
        toast.success('Bem vindo(a) de volta!')
        navigate("/dashboard")

      }).catch(error => {
        setLoadingAuth(false)
        console.log(error)
        toast.error('Algo deu errado!')
      })

  }

  //cadastro de usuario
  async function signUp(email, password, name) {
    setLoadingAuth(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid
        await setDoc(doc(database, "users", uid), {
          name: name,
          avatarUrl: null
        })

          .then(() => {
            let data = {
              uid: uid,
              name: name,
              email: value.user.email,
              avatarUrl: null
            }
            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            navigate("/dashboard")
            toast.success('Cadastrado com sucesso, seja bem vindo(a)!')

          })
      })
      .catch(error => {
        toast.error('Algo deu errado!')
        console.log(error)
        setLoadingAuth(false)
      })
  }

  function storageUser(data) {
    localStorage.setItem('SistemaUser', JSON.stringify(data))
  }

  //sair
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
        loadingAuth,
        setUser,
        storageUser
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
