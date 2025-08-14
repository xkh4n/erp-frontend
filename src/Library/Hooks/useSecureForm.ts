import { useState, useCallback } from 'react';
// import { showErrorToast, showSuccessToast } from '../../Components/Toast';

interface FormData {
    success: boolean;
    data?: unknown;
    error?: string;
}

interface UseSecureFormConfig {
    minDelayMs?: number;
    timeoutMs?: number;
    onSuccess?: (data: FormData) => void;
    onError?: (error: Error) => void;
}

interface UseSecureFormReturn {
    isLoading: boolean;
    submitForm: (submitFunction: () => Promise<FormData>) => Promise<FormData>;
    setLoading: (loading: boolean) => void;
}

/**
 * Hook para manejo seguro de formularios con protección contra timing attacks
 * y manejo consistente de errores
 */
export const useSecureForm = (config: UseSecureFormConfig = {}): UseSecureFormReturn => {
    const {
        minDelayMs = 1000,
        timeoutMs = 5000,
        onSuccess,
        onError
    } = config;

    const [isLoading, setIsLoading] = useState(false);

    const submitForm = useCallback(async (submitFunction: () => Promise<FormData>) => {
        setIsLoading(true);
        const startTime = Date.now();

        try {
            // Ejecutar la función de envío
            const result = await Promise.race([
                submitFunction(),
                new Promise<FormData>((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
                )
            ]);

            // Asegurar delay mínimo para prevenir timing attacks
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < minDelayMs) {
                await new Promise(resolve => setTimeout(resolve, minDelayMs - elapsedTime));
            }

            if (onSuccess) {
                onSuccess(result);
            }

            return result;

        } catch (error) {
            // Asegurar delay mínimo incluso en errores
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < minDelayMs) {
                await new Promise(resolve => setTimeout(resolve, minDelayMs - elapsedTime));
            }

            if (onError && error instanceof Error) {
                onError(error);
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [minDelayMs, timeoutMs, onSuccess, onError]);

    const setLoading = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    return {
        isLoading,
        submitForm,
        setLoading
    };
};

export default useSecureForm;
