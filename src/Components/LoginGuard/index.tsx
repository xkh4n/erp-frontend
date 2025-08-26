import React, { useEffect } from 'react';
import { useAuth } from '../../Library/Hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginGuardProps {
    children: React.ReactNode;
}

/**
 * Componente que redirige a la página principal si el usuario ya está autenticado
 */
export const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Si ya está autenticado, redirigir a la página de donde venía o al home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, location]);

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
                <span className="ml-3 text-gray-600">Verificando autenticación...</span>
            </div>
        );
    }

    // Si no está autenticado, mostrar el formulario de login
    if (!isAuthenticated) {
        return <>{children}</>;
    }

    // Si está autenticado, no mostrar nada (el useEffect se encargará del redirect)
    return null;
};

export default LoginGuard;
