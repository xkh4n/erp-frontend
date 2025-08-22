import React from 'react';
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
        <div className={`flex items-center space-x-3 ${className}`}>
            <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-gray-700">
                    {user.name || user.username}
                </span>
                {user.role && (
                    <span className="text-xs text-gray-500 capitalize">
                        {user.role}
                    </span>
                )}
            </div>
            
            <div className="relative group">
                <button className="flex items-center justify-center w-8 h-8 bg-blue-950 text-white rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
                    {(user.name || user.username).charAt(0).toUpperCase()}
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            <div className="font-medium">{user.name || user.username}</div>
                            <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
