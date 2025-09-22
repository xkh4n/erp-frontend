import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../Utils/errorHandler';

export type EstadisticaCategoria = {
    _id: string;
    categoria: string;
    codigo: string;
    cantidad: number;
    valorTotal: number;
};

export type EstadisticaEstado = {
    _id: string;
    estado: string;
    cantidad: number;
};

export type EstadisticaUbicacion = {
    _id: string;
    cantidad: number;
    valorTotal: number;
};

export type ResumenInventario = {
    totalItems: number;
    valorTotal: number;
};

export type EstadisticasInventario = {
    resumen: ResumenInventario;
    porCategoria: EstadisticaCategoria[];
    porEstado: EstadisticaEstado[];
    porUbicacion: EstadisticaUbicacion[];
};

interface UseInventarioEstadisticasReturn {
    estadisticas: EstadisticasInventario | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook personalizado para manejar estadísticas del inventario para el dashboard
 * @returns {UseInventarioEstadisticasReturn} Objeto con estadísticas, estado de carga, error y función de recarga
 */
export const useInventarioEstadisticas = (): UseInventarioEstadisticasReturn => {
    const [estadisticas, setEstadisticas] = useState<EstadisticasInventario | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const fetchEstadisticas = useCallback(async () => {

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/inventario/estadisticas`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setEstadisticas(response.data.data);
            } else {
                setError('Error al obtener estadísticas del inventario');
            }
        } catch (error: unknown) {
            console.error('Error al cargar estadísticas del inventario:', error);
            handleError(error, navigate);
            setError('Error al cargar estadísticas del inventario');
        } finally {
            setLoading(false);
        }
    }, [ navigate]);

    useEffect(() => {
        fetchEstadisticas();
    }, [fetchEstadisticas]);

    return {
        estadisticas,
        loading,
        error,
        refetch: fetchEstadisticas
    };
};