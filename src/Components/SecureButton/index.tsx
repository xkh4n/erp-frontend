import React from 'react';
import { IonIcon } from '@ionic/react';

interface SecureButtonProps {
    isLoading: boolean;
    isBlocked: boolean;
    loadingText?: string;
    blockedText?: string;
    normalText?: string;
    icon?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

/**
 * Componente de botón reutilizable con estados de seguridad
 * Maneja estados de loading, bloqueado y normal
 */
export const SecureButton: React.FC<SecureButtonProps> = ({
    isLoading,
    isBlocked,
    loadingText = "Procesando...",
    blockedText = "Bloqueado",
    normalText = "Enviar",
    icon,
    type = "submit",
    onClick,
    className = "",
    disabled = false,
    variant = "primary"
}) => {
    const isDisabled = isLoading || isBlocked || disabled;

    const getVariantClasses = () => {
        const base = "flex justify-center items-center text-white focus:outline-none focus:ring py-2 w-full rounded-full shadow-xl transition delay-10 duration-300 ease-in-out";
        
        if (isDisabled) {
            return `${base} bg-gray-400 cursor-not-allowed`;
        }

        switch (variant) {
            case 'primary':
                return `${base} bg-blue-950 hover:bg-blue-800 shadow-blue-600/50 hover:shadow-blue-800/50 hover:translate-y-1`;
            case 'secondary':
                return `${base} bg-gray-600 hover:bg-gray-700 shadow-gray-500/50 hover:shadow-gray-700/50 hover:translate-y-1`;
            case 'danger':
                return `${base} bg-red-600 hover:bg-red-700 shadow-red-500/50 hover:shadow-red-700/50 hover:translate-y-1`;
            case 'success':
                return `${base} bg-green-600 hover:bg-green-700 shadow-green-500/50 hover:shadow-green-700/50 hover:translate-y-1`;
            default:
                return `${base} bg-blue-950 hover:bg-blue-800 shadow-blue-600/50 hover:shadow-blue-800/50 hover:translate-y-1`;
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-1"></div>
                    <p className="ml-1 text-lg">{loadingText}</p>
                </>
            );
        }

        if (isBlocked) {
            return (
                <>
                    <span className="mr-1">🔒</span>
                    <p className="text-lg">{blockedText}</p>
                </>
            );
        }

        return (
            <>
                {icon && <IonIcon icon={icon} className="w-5 h-5" />}
                <p className={`text-lg ${icon ? 'ml-1' : ''}`}>{normalText}</p>
            </>
        );
    };

    return (
        <button
            type={type}
            disabled={isDisabled}
            onClick={onClick}
            className={`${getVariantClasses()} ${className}`}
            aria-label={isLoading ? loadingText : isBlocked ? blockedText : normalText}
        >
            {renderContent()}
        </button>
    );
};

export default SecureButton;
