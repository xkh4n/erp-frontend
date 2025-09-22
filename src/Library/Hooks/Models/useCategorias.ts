import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError } from '../../Utils/errorHandler';

export type Categoria = {
    _id: string;
    codigo: string;
    nombre: string;
};

interface UseCategoriasReturn {
    categorias: Categoria[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook personalizado para manejar la carga de categorías
 * @returns {UseCategoriasReturn} Objeto con categorías, estado de carga, error y función de recarga
 */
export const useCategorias = (): UseCategoriasReturn => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { accessToken, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Función helper para manejo de errores con contexto
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);

    // Función para cargar las categorías
    const fetchCategorias = useCallback(async () => {
        if (!isAuthenticated || !accessToken) {
            console.warn('Usuario no autenticado para cargar categorías');
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/categoria/todos`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Ordenar categorías por nombre
            const categoriasOrdenadas = response.data.data?.sort((a: Categoria, b: Categoria) => 
                a.nombre.localeCompare(b.nombre)
            ) || [];
            
            setCategorias(categoriasOrdenadas);
        } catch (err) {
            const errorMessage = 'Error al cargar las categorías';
            setError(errorMessage);
            handleErrorWithContext(err);
            console.error(errorMessage, err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, accessToken, handleErrorWithContext]);

    // Cargar categorías cuando el componente se monta y cuando cambia la autenticación
    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchCategorias();
        }
    }, [isAuthenticated, accessToken, fetchCategorias]);

    return {
        categorias,
        loading,
        error,
        refetch: fetchCategorias
    };
};

export default useCategorias;