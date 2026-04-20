import { ReactElement, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import type { UserRole } from '../types'

interface PrivateProps {
  children: ReactElement
  allowedRoles?: UserRole[]
}

const Private = ({ children, allowedRoles }: PrivateProps) => {
  const { signed, loading, user } = useContext(AuthContext)

  if (loading) {
    return <div />
  }

  if (!signed) {
    return <Navigate to="/" />
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default Private
