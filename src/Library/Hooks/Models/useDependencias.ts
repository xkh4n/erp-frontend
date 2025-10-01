import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError } from '../../Utils/errorHandler';


export type Dependencia = {
    _id: string;
    codigo: number;
    nombre: string;
};

interface UseDependenciasReturn {
    dependencias: Dependencia[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/** Hook personalizado para manejar la carga de dependencias
 * @returns {UseDependenciasReturn} Objeto con dependencias, estado de carga, error y función de recarga
 */
export const useDependencias = (): UseDependenciasReturn => {
    const [dependencias, setDependencias] = useState<Dependencia[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const  { accessToken, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Función helper para manejo de errores con contexto
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);

    // Función para cargar las dependencias
    const fetchDependencias = useCallback(async () => {
        if (!isAuthenticated || !accessToken) {
            console.warn('Usuario no autenticado para cargar dependencias');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/dependencia/todas`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            const dependenciasOrdenadas = response.data.sort((a: Dependencia, b: Dependencia) => a.nombre.localeCompare(b.nombre));
            setDependencias(dependenciasOrdenadas);
        } catch (error) {
            const errorMessage = 'Error al cargar los centros de costo';
            setError(errorMessage);
            handleErrorWithContext(error);
            console.error(errorMessage, error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, accessToken, handleErrorWithContext]);

    useEffect(() => {
        if(isAuthenticated && accessToken){
            fetchDependencias();
        }
    }, [isAuthenticated, accessToken, fetchDependencias]);

    return {
        dependencias,
        loading,
        error,
        refetch: fetchDependencias
    };
};

export default useDependencias;
