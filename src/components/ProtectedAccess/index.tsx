import { ReactNode } from 'react'
import { usePermissions } from '../../hooks/usePermissions'
import type { RBACPermissions, UserRole } from '../../types'

interface ProtectedByRoleProps {
    children: ReactNode
    roles: UserRole[]
    fallback?: ReactNode
}

export function ProtectedByRole({ children, roles, fallback = null }: ProtectedByRoleProps) {
    const { hasAnyRole } = usePermissions()

    if (!hasAnyRole(roles)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

interface ProtectedByPermissionProps {
    children: ReactNode
    permission: keyof RBACPermissions
    fallback?: ReactNode
}

export function ProtectedByPermission({
    children,
    permission,
    fallback = null
}: ProtectedByPermissionProps) {
    const { hasPermission } = usePermissions()

    if (!hasPermission(permission)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
