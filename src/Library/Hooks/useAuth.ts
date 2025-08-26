import { useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import type { AuthContextType } from '../Context/AuthContext';

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export default useAuth;
