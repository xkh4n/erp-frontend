import { useAuth } from './useAuth';

/**
 * Hook para verificar permisos en componentes
 * Utiliza permisos dinámicos cargados desde el backend
 */
export const usePermissions = () => {
    const { user } = useAuth();
    
    const hasPermission = (permission: string): boolean => {
        return user?.permissions?.includes(permission) || false;
    };
    
    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };
    
    const hasAllPermissions = (permissions: string[]): boolean => {
        return permissions.every(permission => hasPermission(permission));
    };
    
    const hasRole = (role: string): boolean => {
        return user?.role === role;
    };
    
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.includes(user?.role || '');
    };
    
    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        userPermissions: user?.permissions || [],
        userRole: user?.role
    };
};