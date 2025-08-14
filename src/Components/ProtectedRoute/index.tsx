import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Library/Hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
    requiredRoles?: string[];
    fallbackPath?: string;
}

/**
 * Componente para proteger rutas que requieren autenticación
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requiredRoles,
    fallbackPath = '/login'
}) => {
    const { isAuthenticated, isLoading, hasRole, hasAnyRole } = useAuth();
    const location = useLocation();

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

    // Verificar roles si se especifican
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (requiredRoles && !hasAnyRole(requiredRoles)) {
        return <Navigate to="/unauthorized" replace />;
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
