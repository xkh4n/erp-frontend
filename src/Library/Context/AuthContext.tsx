import React, { createContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../../Components/Toast';

// Interfaces
export interface User {
    id: string;
    username: string;
    name?: string;
    nombre?: string;
    role?: string;
    permissions?: string[];
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    refreshAccessToken: () => Promise<boolean>;
    checkAuthStatus: () => Promise<void>;
}

// Actions
type AuthAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; accessToken: string; refreshToken: string } }
    | { type: 'LOGOUT' }
    | { type: 'REFRESH_SUCCESS'; payload: { accessToken: string; refreshToken?: string } }
    | { type: 'AUTH_ERROR' };

// Initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
    refreshToken: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                isLoading: false,
            };
        case 'REFRESH_SUCCESS':
            return {
                ...state,
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken || state.refreshToken,
                isLoading: false,
            };
        case 'AUTH_ERROR':
            return {
                ...initialState,
                isLoading: false,
            };
        default:
            return state;
    }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

// Provider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    // Función para refrescar token
    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh`, {
                refreshToken
            });

            if (response.data && response.data.data) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                
                // Actualizar tokens
                localStorage.setItem('accessToken', accessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
                
                dispatch({
                    type: 'REFRESH_SUCCESS',
                    payload: {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                });

                return true;
            }
            
            throw new Error('Invalid refresh response');
            
        } catch (error) {
            console.error('Error refreshing token:', error);
            dispatch({ type: 'AUTH_ERROR' });
            
            // Limpiar tokens inválidos
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            return false;
        }
    }, []);

    // Función de logout
    const logout = useCallback(async () => {
        try {
            // Intentar hacer logout en el servidor
            if (state.refreshToken) {
                await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {
                    refreshToken: state.refreshToken
                });
            }
        } catch (error) {
            console.error('Error al hacer logout en el servidor:', error);
        } finally {
            // Limpiar tokens locales
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            dispatch({ type: 'LOGOUT' });
            showSuccessToast('Sesión cerrada correctamente');
        }
    }, [state.refreshToken]);

    // Verificar estado de autenticación al cargar
    const checkAuthStatus = useCallback(async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken || !refreshToken) {
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }

            // Verificar si el token es válido decodificándolo
            try {
                // Decodificar el JWT para verificar expiración
                const tokenParts = accessToken.split('.');
                if (tokenParts.length !== 3) {
                    throw new Error('Invalid token format');
                }

                const payload = JSON.parse(atob(tokenParts[1]));
                const currentTime = Math.floor(Date.now() / 1000);

                // Si el token no ha expirado, consideramos que el usuario está autenticado
                if (payload.exp && payload.exp > currentTime) {
                    // Token válido, crear objeto de usuario básico desde el payload
                    const user = {
                        id: payload.userId || payload.sub,
                        username: payload.username,
                        nombre: payload.nombre,
                        email: payload.email,
                        role: payload.role,
                        // Agregar más campos según la estructura del token
                    };

                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user,
                            accessToken,
                            refreshToken,
                        },
                    });
                    return;
                }

                // Token expirado, intentar refrescar
                const refreshSuccess = await refreshAccessToken();
                if (!refreshSuccess) {
                    dispatch({ type: 'AUTH_ERROR' });
                }
                
            } catch (error) {
                console.error('Error decoding token:', error);
                // Si hay error decodificando, intentar refrescar token
                const refreshSuccess = await refreshAccessToken();
                if (!refreshSuccess) {
                    dispatch({ type: 'AUTH_ERROR' });
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            dispatch({ type: 'AUTH_ERROR' });
        }
    }, [refreshAccessToken]);

    // Configurar axios con interceptores
    useEffect(() => {
        // Request interceptor
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (state.accessToken) {
                    config.headers.Authorization = `Bearer ${state.accessToken}`;
                }
                
                // Headers de seguridad requeridos por el backend
                config.headers['X-Requested-With'] = 'XMLHttpRequest';
                config.headers['Content-Type'] = 'application/json';
                
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Intentar refrescar el token
                    const refreshSuccess = await refreshAccessToken();
                    if (refreshSuccess) {
                        // Reintentar la petición original con el nuevo token
                        originalRequest.headers.Authorization = `Bearer ${state.accessToken}`;
                        return axios(originalRequest);
                    } else {
                        // Si no se puede refrescar, hacer logout
                        logout();
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [state.accessToken, refreshAccessToken, logout]);

    // Función de login
    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                username,
                password
            });

            if (response.data && response.data.data) {
                const { user, tokens } = response.data.data;
                
                // Guardar tokens en localStorage
                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);
                
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        user,
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    },
                });

                showSuccessToast('Inicio de sesión exitoso');
                return true;
            }
            
            throw new Error('Respuesta inválida del servidor');
            
        } catch (error: unknown) {
            dispatch({ type: 'AUTH_ERROR' });
            
            const axiosError = error as { response?: { status: number } };
            if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                showErrorToast('Credenciales incorrectas');
            } else if (axiosError.response?.status === 404) {
                showErrorToast('Usuario no encontrado');
            } else if (axiosError.response?.status === 423) {
                showErrorToast('Cuenta bloqueada. Intenta más tarde');
            } else {
                showErrorToast('Error al iniciar sesión');
            }
            
            return false;
        }
    }, []);

    // Verificar autenticación al montar el componente
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        refreshAccessToken,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
