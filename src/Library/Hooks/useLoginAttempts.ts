import { useState, useEffect, useCallback } from 'react';
import { showErrorToast } from '../../Components/Toast';

interface UseLoginAttemptsConfig {
    maxAttempts?: number;
    blockDurationMinutes?: number;
    storageKey?: string;
    onBlocked?: (remainingTime: number) => void;
    onAttemptFailed?: (remainingAttempts: number) => void;
}

interface UseLoginAttemptsReturn {
    loginAttempts: number;
    isBlocked: boolean;
    blockTime: Date | null;
    handleFailedAttempt: () => void;
    clearLoginAttempts: () => void;
    checkIfBlocked: () => boolean;
    getRemainingTime: () => number;
}

/**
 * Hook personalizado para manejar intentos de login y bloqueos de seguridad
 * Reutilizable en cualquier formulario de autenticación
 */
export const useLoginAttempts = (config: UseLoginAttemptsConfig = {}): UseLoginAttemptsReturn => {
    const {
        maxAttempts = 3,
        blockDurationMinutes = 15,
        storageKey = 'loginAttempts',
        onBlocked,
        onAttemptFailed
    } = config;

    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTime, setBlockTime] = useState<Date | null>(null);

    const storageAttemptKey = `${storageKey}_count`;
    const storageBlockKey = `${storageKey}_blockTime`;

    // Función para verificar si el usuario está bloqueado
    const checkIfBlocked = useCallback((): boolean => {
        const storedBlockTime = localStorage.getItem(storageBlockKey);
        if (storedBlockTime) {
            const blockTimeDate = new Date(storedBlockTime);
            const now = new Date();
            const timeDiff = (now.getTime() - blockTimeDate.getTime()) / (1000 * 60); // en minutos
            
            if (timeDiff < blockDurationMinutes) {
                setIsBlocked(true);
                setBlockTime(blockTimeDate);
                const remainingTime = Math.ceil(blockDurationMinutes - timeDiff);
                
                if (onBlocked) {
                    onBlocked(remainingTime);
                } else {
                    showErrorToast(`Cuenta bloqueada. Intenta de nuevo en ${remainingTime} minutos.`);
                }
                return true;
            } else {
                // El bloqueo ha expirado
                localStorage.removeItem(storageBlockKey);
                localStorage.removeItem(storageAttemptKey);
                setIsBlocked(false);
                setBlockTime(null);
                setLoginAttempts(0);
            }
        }
        return false;
    }, [blockDurationMinutes, storageBlockKey, storageAttemptKey, onBlocked]);

    // Función para obtener tiempo restante de bloqueo
    const getRemainingTime = useCallback((): number => {
        if (!blockTime) return 0;
        const now = new Date();
        const timeDiff = (now.getTime() - blockTime.getTime()) / (1000 * 60);
        return Math.max(0, Math.ceil(blockDurationMinutes - timeDiff));
    }, [blockTime, blockDurationMinutes]);

    // Función para manejar intentos fallidos
    const handleFailedAttempt = useCallback(() => {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem(storageAttemptKey, newAttempts.toString());

        if (newAttempts >= maxAttempts) {
            const blockTimeDate = new Date();
            setIsBlocked(true);
            setBlockTime(blockTimeDate);
            localStorage.setItem(storageBlockKey, blockTimeDate.toISOString());
            
            if (onBlocked) {
                onBlocked(blockDurationMinutes);
            } else {
                showErrorToast(`Demasiados intentos fallidos. Cuenta bloqueada por ${blockDurationMinutes} minutos.`);
            }
        } else {
            const remaining = maxAttempts - newAttempts;
            if (onAttemptFailed) {
                onAttemptFailed(remaining);
            } else {
                showErrorToast(`Credenciales incorrectas. Te quedan ${remaining} intentos.`);
            }
        }
    }, [loginAttempts, maxAttempts, blockDurationMinutes, storageAttemptKey, storageBlockKey, onBlocked, onAttemptFailed]);

    // Función para limpiar intentos después de login exitoso
    const clearLoginAttempts = useCallback(() => {
        localStorage.removeItem(storageAttemptKey);
        localStorage.removeItem(storageBlockKey);
        setLoginAttempts(0);
        setIsBlocked(false);
        setBlockTime(null);
    }, [storageAttemptKey, storageBlockKey]);

    // Verificar bloqueo al cargar el componente
    useEffect(() => {
        const storedAttempts = localStorage.getItem(storageAttemptKey);
        if (storedAttempts) {
            setLoginAttempts(parseInt(storedAttempts));
        }
        checkIfBlocked();
    }, [checkIfBlocked, storageAttemptKey]);

    return {
        loginAttempts,
        isBlocked,
        blockTime,
        handleFailedAttempt,
        clearLoginAttempts,
        checkIfBlocked,
        getRemainingTime
    };
};

export default useLoginAttempts;
