import type { ServiceCall, UserRole } from '../types'

/**
 * Filtra chamados de serviço baseado no role do usuário
 */
export function filterCallsByRole(
  calls: ServiceCall[],
  role: UserRole,
  userId: string
): ServiceCall[] {
  switch (role) {
    case 'admin':
      // Admin vê todos os chamados
      return calls

    case 'tecnico':
      // Técnico vê apenas chamados atribuídos a ele
      // (userId é o uid do técnico)
      return calls.filter(call => call.userId === userId)

    case 'cliente':
      // Cliente vê apenas seus próprios chamados
      return calls.filter(call => call.clientId === userId)

    default:
      return []
  }
}

/**
 * Verifica se um usuário pode executar uma ação em um chamado
 */
export function canPerformAction(
  action: 'view' | 'edit' | 'delete' | 'create',
  role: UserRole,
  callData?: {
    clientId: string
    userId: string
  },
  currentUserId?: string
): boolean {
  switch (role) {
    case 'admin':
      // Admin pode fazer qualquer coisa
      return true

    case 'tecnico':
      if (action === 'view' || action === 'edit') {
        // Técnico pode ver e editar chamados atribuídos a ele
        return callData?.userId === currentUserId
      }
      return false

    case 'cliente':
      if (action === 'create') {
        // Cliente pode criar chamados
        return true
      }
      if (action === 'view') {
        // Cliente pode ver seus próprios chamados
        return callData?.clientId === currentUserId
      }
      return false

    default:
      return false
  }
}

/**
 * Retorna o título do role em formato legível
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: 'Administrador',
    tecnico: 'Técnico',
    cliente: 'Cliente'
  }
  return labels[role]
}

/**
 * Retorna uma cor para o badge do role
 */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: '#FF6B6B', // Vermelho
    tecnico: '#4ECDC4', // Teal
    cliente: '#45B7D1' // Azul
  }
  return colors[role]
}

/**
 * Constrói query de filtro para Firestore baseado no role
 */
export function buildQueryFilterByRole(
  role: UserRole,
  userId: string
): { field?: string; operator?: string; value?: string } | null {
  switch (role) {
    case 'admin':
      // Admin não precisa de filtro
      return null

    case 'tecnico':
      // Filtrar por usuario assignado
      return {
        field: 'userId',
        operator: '==',
        value: userId
      }

    case 'cliente':
      // Filtrar por clientId
      return {
        field: 'clientId',
        operator: '==',
        value: userId
      }

    default:
      return null
  }
}
