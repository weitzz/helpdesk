import { ReactElement, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'

interface PrivateProps {
  children: ReactElement
}

const Private = ({ children }: PrivateProps) => {
  const { signed, loading } = useContext(AuthContext)

  if (loading) {
    return <div />
  }

  if (!signed) {
    return <Navigate to="/" />
  }

  return children
}

export default Private
