import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError } from '../../Utils/errorHandler';

export type Proveedor = {
    _id: string;
    razonSocial: string;
    nombre?: string;
};

interface UseProveedoresReturn {
    proveedores: Proveedor[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la carga de proveedores
 * @returns {UseProveedoresReturn} Objeto con proveedores, estado de carga, error y función de recarga
 */
export const useProveedores = (): UseProveedoresReturn => {
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { accessToken, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Función helper para manejo de errores con contexto
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);

    // Función para cargar los proveedores
    const fetchProveedores = useCallback(async () => {
        if (!isAuthenticated || !accessToken) {
            console.warn('Usuario no autenticado para cargar proveedores');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/proveedor/todos`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Ordenar proveedores por razón social
            const proveedoresOrdenados = response.data.data?.sort((a: Proveedor, b: Proveedor) => 
                a.razonSocial.localeCompare(b.razonSocial)
            ) || [];
            
            setProveedores(proveedoresOrdenados);
        } catch (err) {
            const errorMessage = 'Error al cargar los proveedores';
            setError(errorMessage);
            handleErrorWithContext(err);
            console.error(errorMessage, err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, accessToken, handleErrorWithContext]);

    // Cargar proveedores cuando el componente se monta y cuando cambia la autenticación
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchProveedores();
        }
    }, [isAuthenticated, accessToken, fetchProveedores]);

    return {
        proveedores,
        loading,
        error,
        refetch: fetchProveedores
    };
};

export default useProveedores;