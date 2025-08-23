import axios from 'axios';
import { CustomError } from '../Errores';

export type ErrorState = {
    code: number;
    message: string;
    detail: string;
    from?: string;
};

export function handleError(
    error: unknown,
    navigate: (path: string, options?: { state: ErrorState }) => void,
    currentPath?: string
) {
    if (error instanceof CustomError) {
        const errorData = error.toJSON();
        navigate("/error", {
            state: {
                code: errorData.code,
                message: errorData.message,
                detail: errorData.details || 'Error en la aplicación',
                from: currentPath
            }
        });
    } else if (error instanceof axios.AxiosError) {
        // Extraer el mensaje del backend si existe
        const backendMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.response?.data?.msg ||
                               error.response?.data?.data?.message;
        
        const backendDetail = error.response?.data?.details || 
                              error.response?.data?.data?.details ||
                              error.response?.statusText;
        
        navigate("/error", {
            state: {
                code: error.response?.status || 500,
                message: backendMessage || error.message || "Error de conexión",
                detail: backendDetail || "Error desconocido del servidor",
                from: currentPath
            }
        });
    } else {
        // Error desconocido
        navigate("/error", {
            state: {
                code: 500,
                message: error instanceof Error ? error.message : "Error desconocido",
                detail: "Se ha producido un error inesperado",
                from: currentPath
            }
        });
    }
}
