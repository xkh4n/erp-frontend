import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface EstadisticaUbicacion {
    codigo: string;
    ubicacion: string;
    cantidad: number;
    valorTotal: number;
}

interface EstadisticasUbicacionResponse {
    porUbicacion: EstadisticaUbicacion[];
    porCentroCosto: EstadisticaUbicacion[];
}

interface UseInventarioEstadisticasUbicacionResult {
    data: EstadisticasUbicacionResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useInventarioEstadisticasUbicacion = (): UseInventarioEstadisticasUbicacionResult => {
    const [data, setData] = useState<EstadisticasUbicacionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEstadisticas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/inventario/estadisticas/ubicacion`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success) {

                setData(response.data.data);
            } else {
                setError('Error al obtener las estadísticas por ubicación');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error de conexión');
            } else {
                setError('Error desconocido');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const refetch = useCallback(() => {
        fetchEstadisticas();
    }, [fetchEstadisticas]);

    useEffect(() => {
        fetchEstadisticas();
    }, [fetchEstadisticas]);

    return {
        data,
        loading,
        error,
        refetch
    };
};

export default useInventarioEstadisticasUbicacion;
export type { EstadisticaUbicacion, EstadisticasUbicacionResponse };