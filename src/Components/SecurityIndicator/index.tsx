import React from 'react';

interface SecurityIndicatorProps {
    isBlocked: boolean;
    blockTime: Date | null;
    loginAttempts: number;
    maxAttempts: number;
    blockDurationMinutes: number;
    className?: string;
}

/**
 * Componente reutilizable para mostrar indicadores de seguridad
 * Muestra información sobre bloqueos y intentos restantes
 */
export const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({
    isBlocked,
    blockTime,
    loginAttempts,
    maxAttempts,
    blockDurationMinutes,
    className = ""
}) => {
    if (isBlocked && blockTime) {
        return (
            <div className={`mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm ${className}`}>
                <div className="flex items-center">
                    <span className="text-red-500 mr-2">🔒</span>
                    <div>
                        <p className="font-semibold">Cuenta temporalmente bloqueada</p>
                        <p className="text-xs">Por motivos de seguridad, después de {maxAttempts} intentos fallidos.</p>
                        <p className="text-xs">Podrás intentar nuevamente en {blockDurationMinutes} minutos.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isBlocked && loginAttempts > 0) {
        return (
            <div className={`mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm text-center ${className}`}>
                <span className="text-yellow-500 mr-1">⚠️</span>
                Te quedan {maxAttempts - loginAttempts} intentos antes del bloqueo
            </div>
        );
    }

    return null;
};

export default SecurityIndicator;
