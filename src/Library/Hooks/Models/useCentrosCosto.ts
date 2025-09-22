import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError } from '../../Utils/errorHandler';

export type CentroCosto = {
    _id: string;
    codigo: number;
    nombre: string;
};

interface UseCentrosCostoReturn {
    centrosCostos: CentroCosto[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la carga de centros de costo
 * @returns {UseCentrosCostoReturn} Objeto con centros de costo, estado de carga, error y función de recarga
 */
export const useCentrosCosto = (): UseCentrosCostoReturn => {
    const [centrosCostos, setCentrosCostos] = useState<CentroCosto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { accessToken, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Función helper para manejo de errores con contexto
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);

    // Función para cargar los centros de costo
    const fetchCentrosCosto = useCallback(async () => {
        if (!isAuthenticated || !accessToken) {
            console.warn('Usuario no autenticado para cargar centros de costo');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/ccosto/getall`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Ordenar centros de costo por nombre
            const centrosOrdenados = response.data.data.centros?.sort((a: CentroCosto, b: CentroCosto) => 
                a.nombre.localeCompare(b.nombre)
            ) || [];
            
            setCentrosCostos(centrosOrdenados);
        } catch (err) {
            const errorMessage = 'Error al cargar los centros de costo';
            setError(errorMessage);
            handleErrorWithContext(err);
            console.error(errorMessage, err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, accessToken, handleErrorWithContext]);

    // Cargar centros de costo cuando el componente se monta y cuando cambia la autenticación
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchCentrosCosto();
        }
    }, [isAuthenticated, accessToken, fetchCentrosCosto]);

    return {
        centrosCostos,
        loading,
        error,
        refetch: fetchCentrosCosto
    };
};

export default useCentrosCosto;