import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Library/Hooks/useAuth';
import { ROUTE_PERMISSIONS } from '../../Library/Security/permissions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
    requiredRoles?: string[];
    requiredPermission?: string;
    requiredPermissions?: string[];
    requireAllPermissions?: boolean; // true = AND, false = OR
    fallbackPath?: string;
    showUnauthorizedPage?: boolean;
}

/**
 * Componente mejorado para proteger rutas con validación de permisos específicos
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requiredRoles,
    requiredPermission,
    requiredPermissions,
    requireAllPermissions = false,
    fallbackPath = '/login',
    showUnauthorizedPage = true
}) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Determinar permisos requeridos automáticamente basándose en la ruta
    const autoPermissions = ROUTE_PERMISSIONS[location.pathname];
    const effectivePermissions = requiredPermissions || 
                               (requiredPermission ? [requiredPermission] : autoPermissions);

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
                <span className="ml-3 text-gray-600">Verificando autenticación...</span>
            </div>
        );
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
    }

    // Verificar rol requerido único
    if (requiredRole && user?.role !== requiredRole) {
        if (showUnauthorizedPage) {
            return <Navigate to="/unauthorized" state={{ 
                code: 403, 
                message: "Rol Insuficiente",
                detail: `Se requiere el rol: ${requiredRole}. Tu rol actual: ${user?.role || 'ninguno'}`
            }} replace />;
        }
        return <Navigate to={fallbackPath} replace />;
    }

    if (requiredRoles && !requiredRoles.includes(user?.role || '')) {
        if (showUnauthorizedPage) {
            return <Navigate to="/unauthorized" state={{ 
                code: 403, 
                message: "Rol Insuficiente",
                detail: `Se requiere uno de estos roles: ${requiredRoles.join(', ')}. Tu rol actual: ${user?.role || 'ninguno'}`
            }} replace />;
        }
        return <Navigate to={fallbackPath} replace />;
    }

    // Verificar permisos si se especifican
    if (effectivePermissions && effectivePermissions.length > 0) {
        const userPermissions = user?.permissions || [];
        
        let hasPermission = false;
        
        if (requireAllPermissions) {
            // Requiere TODOS los permisos (AND)
            hasPermission = effectivePermissions.every(permission => 
                userPermissions.includes(permission)
            );
        } else {
            // Requiere AL MENOS UNO de los permisos (OR)
            hasPermission = effectivePermissions.some(permission => 
                userPermissions.includes(permission)
            );
        }

        if (!hasPermission) {
            console.warn(`Acceso denegado para ${user?.username} en ${location.pathname}. Permisos requeridos: ${effectivePermissions.join(', ')}, Permisos del usuario: ${userPermissions.join(', ')}`);
            
            if (showUnauthorizedPage) {
                return <Navigate to="/unauthorized" state={{ 
                    code: 403, 
                    message: "Permisos Insuficientes",
                    detail: requireAllPermissions 
                        ? `Se requieren todos estos permisos: ${effectivePermissions.join(', ')}`
                        : `Se requiere al menos uno de estos permisos: ${effectivePermissions.join(', ')}`
                }} replace />;
            }
            return <Navigate to={fallbackPath} replace />;
        }
    }

    // Si todas las verificaciones pasan, mostrar el contenido
    return <>{children}</>;
};

/**
 * Componente para rutas que solo deben ser accesibles por usuarios no autenticados
 */
export const GuestRoute: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({
    children,
    redirectTo = '/'
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;