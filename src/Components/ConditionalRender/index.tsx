import React from 'react';
import { usePermissions } from '../../Library/Hooks/usePermissions';

interface ConditionalRenderProps {
    permission?: string;
    permissions?: string[];
    requireAll?: boolean; // true = AND, false = OR
    role?: string;
    roles?: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Componente para renderizar contenido condicionalmente basándose en permisos
 */
export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
    permission,
    permissions,
    requireAll = false,
    role,
    roles,
    children,
    fallback = null
}) => {
    const {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole
    } = usePermissions();

    // Verificar permisos
    let hasRequiredPermissions = true;

    if (permission) {
        hasRequiredPermissions = hasPermission(permission);
    } else if (permissions) {
        hasRequiredPermissions = requireAll 
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);
    }

    // Verificar roles
    let hasRequiredRole = true;

    if (role) {
        hasRequiredRole = hasRole(role);
    } else if (roles) {
        hasRequiredRole = hasAnyRole(roles);
    }

    // Mostrar contenido solo si se cumplen todas las condiciones
    if (hasRequiredPermissions && hasRequiredRole) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default ConditionalRender;