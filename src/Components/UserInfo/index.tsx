import React from 'react';
import { IonIcon } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useAuth } from '../../Library/Hooks/useAuth';

interface UserInfoProps {
    className?: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ className = '' }) => {
    const { user, logout } = useAuth();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={`flex items-center justify-between w-full space-x-3 ${className}`}>
            {/* Información del usuario */}
            <div className="flex items-center space-x-3">
                <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-gray-700">
                        {user.nombre || user.name || user.username}
                    </span>
                    {user.role && (
                        <span className="text-xs text-gray-500 capitalize">
                            {user.role}
                        </span>
                    )}
                </div>
                
                {/* Avatar */}
                <div className="flex items-center justify-center w-8 h-8 bg-blue-950 text-white rounded-full text-sm font-medium">
                    {(user.nombre || user.name || user.username).charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Botón de logout */}
            <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Cerrar Sesión"
                aria-label="Cerrar Sesión"
            >
                <IonIcon icon={logOutOutline} className="w-4 h-4" />
            </button>
        </div>
    );
};

export default UserInfo;
