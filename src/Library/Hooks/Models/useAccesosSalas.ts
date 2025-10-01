import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleError } from '../../Utils/errorHandler';

export type AccesoSalasPendientes = {
    _id: string;
    userId: {
        _id: string;
        username: string;
        personId: {
            _id: string;
            name: string;
        };
    };
    salaId: {
        _id: string;
        nombre: string;
    };
    fechaAcceso: Date;
    state: string;
    centrocostoId: {
        _id: string;
        nombre: string;
    };
    beneficiario: string;
    motivo: string;
    autorizadoPor?: string;
    estado: string;
    createdAt: string;
    updatedAt: string;
};


interface UseAccesosSalas {
    accesosPendientes: AccesoSalasPendientes[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/** Hook personalizado para manejar la carga de accesos a salas pendientes
 * @returns {UseAccesosSalas} Objeto con accesos pendientes, estado de carga, error y función de recarga
 */
export const useAccesosSalas = (): UseAccesosSalas => {
    const [accesosPendientes, setAccesosPendientes] = useState<AccesoSalasPendientes[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const  { accessToken, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Función helper para manejo de errores con contexto
    const handleErrorWithContext = useCallback((error: unknown) => {
        handleError(error, navigate, location.pathname);
    }, [navigate, location.pathname]);


    const fetchAccesosPendientes = useCallback(async () => {
        if (!isAuthenticated || !accessToken) {
            console.warn('Usuario no autenticado para cargar dependencias');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/acceso/pendientes`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            const accesosOrdenados = response.data.data.sort((a: AccesoSalasPendientes, b: AccesoSalasPendientes) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setAccesosPendientes(accesosOrdenados);
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
            fetchAccesosPendientes();
        }
    }, [isAuthenticated, accessToken, fetchAccesosPendientes]);

    return {
        accesosPendientes,
        loading,
        error,
        refetch: fetchAccesosPendientes
    };
};

export default useAccesosSalas;