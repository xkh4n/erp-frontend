import { useCallback, useRef } from 'react';

interface UseRateLimitedRequestOptions {
    minDelay?: number; // Tiempo mínimo entre peticiones en ms
    retryDelay?: number; // Tiempo de espera antes de reintentar en caso de 429
    maxRetries?: number; // Máximo número de reintentos
}

/**
 * Hook para manejar peticiones con rate limiting
 * Previene múltiples llamadas rápidas y maneja automáticamente los errores 429
 */
export const useRateLimitedRequest = (options: UseRateLimitedRequestOptions = {}) => {
    const {
        minDelay = 1000, // 1 segundo entre peticiones por defecto
        retryDelay = 3000, // 3 segundos antes de reintentar
        maxRetries = 3
    } = options;

    const lastCallTime = useRef<number>(0);
    const retryCount = useRef<number>(0);

    const executeRequest = useCallback(async <T>(
        requestFn: () => Promise<T>,
        onRateLimit?: () => void
    ): Promise<T | null> => {
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime.current;

        // Si han pasado menos de minDelay ms desde la última llamada, esperar
        if (timeSinceLastCall < minDelay) {
            const waitTime = minDelay - timeSinceLastCall;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        try {
            lastCallTime.current = Date.now();
            const result = await requestFn();
            retryCount.current = 0; // Reset retry count on success
            return result;
        } catch (error: unknown) {
            // Type guard para verificar si es un error de Axios con response
            const isAxiosError = (err: unknown): err is { response?: { status?: number } } => {
                return typeof err === 'object' && err !== null && 'response' in err;
            };

            if (isAxiosError(error) && error.response?.status === 429 && retryCount.current < maxRetries) {
                retryCount.current++;
                console.warn(`Rate limited. Retry ${retryCount.current}/${maxRetries} in ${retryDelay}ms`);
                
                if (onRateLimit) {
                    onRateLimit();
                }

                // Esperar y reintentar
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return executeRequest(requestFn, onRateLimit);
            }
            
            // Si no es rate limit o se agotaron los reintentos, propagar el error
            throw error;
        }
    }, [minDelay, retryDelay, maxRetries]);

    const reset = useCallback(() => {
        lastCallTime.current = 0;
        retryCount.current = 0;
    }, []);

    return {
        executeRequest,
        reset
    };
};

export default useRateLimitedRequest;