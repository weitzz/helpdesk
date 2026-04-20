import type { Timestamp } from 'firebase/firestore'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

export type UserRole = 'admin' | 'tecnico' | 'cliente'

export interface UserData {
  uid: string
  name: string
  email: string | null
  avatarUrl: string | null
  role: UserRole
}

export interface RBACPermissions {
  canViewAllTickets: boolean
  canViewOwnTickets: boolean
  canViewAssignedTickets: boolean
  canCreateTicket: boolean
  canEditTicket: boolean
  canDeleteTicket: boolean
  canViewCustomers: boolean
  canManageUsers: boolean
  canViewReports: boolean
}

export interface AuthContextData {
  signed: boolean
  user: UserData | null
  loading: boolean
  loadingAuth: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
  setUser: Dispatch<SetStateAction<UserData | null>>
  storageUser: (data: UserData) => void
}

export interface AuthProviderProps {
  children: ReactNode
}

export interface Customer {
  id: string
  nameCustomers: string
  cnpj: string
  adress: string
}

export type ServiceStatus = 'Aberto' | 'Progresso' | 'Atendido'
export type ServiceSubject = 'Suporte' | 'Visita Tecnica' | 'Financeiro'
export type ServiceDateValue = Timestamp | Date | string | null

export interface ServiceCall {
  id: string
  client: string
  clientId: string
  subject: ServiceSubject
  status: ServiceStatus
  created: ServiceDateValue
  attendedAt: ServiceDateValue
  descriptions: string
  userId: string
}
