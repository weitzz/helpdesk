import { useContext } from 'react'
import { AuthContext } from '../contexts/auth'
import type { RBACPermissions, UserRole } from '../types'

const rolePermissions: Record<UserRole, RBACPermissions> = {
    admin: {
        canViewAllTickets: true,
        canViewOwnTickets: true,
        canViewAssignedTickets: true,
        canCreateTicket: true,
        canEditTicket: true,
        canDeleteTicket: true,
        canViewCustomers: true,
        canManageUsers: true,
        canViewReports: true
    },
    tecnico: {
        canViewAllTickets: false,
        canViewOwnTickets: false,
        canViewAssignedTickets: true,
        canCreateTicket: false,
        canEditTicket: true,
        canDeleteTicket: false,
        canViewCustomers: false,
        canManageUsers: false,
        canViewReports: false
    },
    cliente: {
        canViewAllTickets: false,
        canViewOwnTickets: true,
        canViewAssignedTickets: false,
        canCreateTicket: true,
        canEditTicket: false,
        canDeleteTicket: false,
        canViewCustomers: false,
        canManageUsers: false,
        canViewReports: false
    }
}

export function usePermissions() {
    const { user } = useContext(AuthContext)

    const permissions: RBACPermissions = user
        ? rolePermissions[user.role]
        : {
            canViewAllTickets: false,
            canViewOwnTickets: false,
            canViewAssignedTickets: false,
            canCreateTicket: false,
            canEditTicket: false,
            canDeleteTicket: false,
            canViewCustomers: false,
            canManageUsers: false,
            canViewReports: false
        }

    function hasPermission(permission: keyof RBACPermissions): boolean {
        return permissions[permission]
    }

    function hasRole(role: UserRole): boolean {
        return user?.role === role
    }

    function hasAnyRole(roles: UserRole[]): boolean {
        return user ? roles.includes(user.role) : false
    }

    return {
        permissions,
        hasPermission,
        hasRole,
        hasAnyRole
    }
}
