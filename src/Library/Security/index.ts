/**
 * Utilidades de Seguridad para el Frontend
 * Funciones para mejorar la seguridad de la aplicación
 */

// Interfaces para Axios
interface AxiosRequestConfig {
    headers: Record<string, string>;
    [key: string]: unknown;
}

interface AxiosResponse {
    data: unknown;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
}

interface AxiosError {
    response?: {
        status: number;
        data: unknown;
    };
    message: string;
}

interface AxiosInstance {
    interceptors: {
        request: {
            use: (onFulfilled: (config: AxiosRequestConfig) => AxiosRequestConfig) => void;
        };
        response: {
            use: (
                onFulfilled: (response: AxiosResponse) => AxiosResponse,
                onRejected: (error: AxiosError) => Promise<never>
            ) => void;
        };
    };
}

// Configuración de seguridad
export const SECURITY_CONFIG = {
    // Configuración de rate limiting
    MAX_LOGIN_ATTEMPTS: 3,
    BLOCK_DURATION_MINUTES: 15,
    
    // Configuración de tokens
    TOKEN_STORAGE_KEY: 'authToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    
    // Configuración de sesión
    SESSION_TIMEOUT_MINUTES: 30,
    IDLE_TIMEOUT_MINUTES: 15,
    
    // Headers de seguridad
    SECURITY_HEADERS: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
};

/**
 * Sanitiza input para prevenir XSS
 */
export const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'");
};

/**
 * Genera un token CSRF simple para prevenir ataques CSRF
 */
export const generateCSRFToken = (): string => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Valida la fuerza de una contraseña
 */
export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
} => {
    const feedback: string[] = [];
    let score = 0;

    // Longitud mínima
    if (password.length >= 8) score += 1;
    else feedback.push('Debe tener al menos 8 caracteres');

    // Longitud recomendada
    if (password.length >= 12) score += 1;

    // Letras minúsculas
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Debe contener al menos una letra minúscula');

    // Letras mayúsculas
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Debe contener al menos una letra mayúscula');

    // Números
    if (/\d/.test(password)) score += 1;
    else feedback.push('Debe contener al menos un número');

    // Caracteres especiales
    if (/[.,;:!?'%$&#?¡@"()[\]{}\-_*]/.test(password)) score += 1;
    else feedback.push('Debe contener al menos un carácter especial');

    // No repetición excesiva
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else feedback.push('No debe tener caracteres repetidos consecutivamente');

    // No secuencias comunes
    const commonSequences = ['123', 'abc', 'qwe', 'asd', 'zxc', '098', '987'];
    const hasCommonSequence = commonSequences.some(seq => 
        password.toLowerCase().includes(seq) || 
        password.toLowerCase().includes(seq.split('').reverse().join(''))
    );
    if (!hasCommonSequence) score += 1;
    else feedback.push('Evita secuencias comunes de teclas');

    return {
        isValid: score >= 6,
        score: Math.min(score, 8),
        feedback
    };
};

/**
 * Manejo seguro de tokens JWT
 */
export class TokenManager {
    private static instance: TokenManager;
    
    private constructor() {}
    
    public static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }
    
    /**
     * Guarda el token de forma segura
     */
    setToken(token: string, remember: boolean = false): void {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(SECURITY_CONFIG.TOKEN_STORAGE_KEY, token);
        
        // Configurar expiración automática
        const expirationTime = Date.now() + (SECURITY_CONFIG.SESSION_TIMEOUT_MINUTES * 60 * 1000);
        storage.setItem(`${SECURITY_CONFIG.TOKEN_STORAGE_KEY}_expires`, expirationTime.toString());
    }
    
    /**
     * Obtiene el token si es válido
     */
    getToken(): string | null {
        const token = localStorage.getItem(SECURITY_CONFIG.TOKEN_STORAGE_KEY) || 
                     sessionStorage.getItem(SECURITY_CONFIG.TOKEN_STORAGE_KEY);
        
        if (!token) return null;
        
        // Verificar expiración
        const expirationTime = localStorage.getItem(`${SECURITY_CONFIG.TOKEN_STORAGE_KEY}_expires`) ||
                              sessionStorage.getItem(`${SECURITY_CONFIG.TOKEN_STORAGE_KEY}_expires`);
        
        if (expirationTime && Date.now() > parseInt(expirationTime)) {
            this.clearToken();
            return null;
        }
        
        return token;
    }
    
    /**
     * Limpia todos los tokens
     */
    clearToken(): void {
        localStorage.removeItem(SECURITY_CONFIG.TOKEN_STORAGE_KEY);
        localStorage.removeItem(`${SECURITY_CONFIG.TOKEN_STORAGE_KEY}_expires`);
        sessionStorage.removeItem(SECURITY_CONFIG.TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(`${SECURITY_CONFIG.TOKEN_STORAGE_KEY}_expires`);
    }
    
    /**
     * Verifica si el token está expirado
     */
    isTokenExpired(): boolean {
        return this.getToken() === null;
    }
}

/**
 * Detecta actividad del usuario para manejar idle timeout
 */
export class IdleTimer {
    private static instance: IdleTimer;
    private idleTimer: NodeJS.Timeout | null = null;
    private warningTimer: NodeJS.Timeout | null = null;
    private onIdle?: () => void;
    private onWarning?: (timeLeft: number) => void;
    
    private constructor() {}
    
    public static getInstance(): IdleTimer {
        if (!IdleTimer.instance) {
            IdleTimer.instance = new IdleTimer();
        }
        return IdleTimer.instance;
    }
    
    /**
     * Inicia el monitor de inactividad
     */
    start(onIdle: () => void, onWarning?: (timeLeft: number) => void): void {
        this.onIdle = onIdle;
        this.onWarning = onWarning;
        
        this.resetTimer();
        this.addEventListeners();
    }
    
    /**
     * Detiene el monitor de inactividad
     */
    stop(): void {
        this.clearTimers();
        this.removeEventListeners();
    }
    
    private resetTimer(): void {
        this.clearTimers();
        
        const idleTimeMs = SECURITY_CONFIG.IDLE_TIMEOUT_MINUTES * 60 * 1000;
        const warningTimeMs = idleTimeMs - (2 * 60 * 1000); // Advertir 2 minutos antes
        
        // Timer de advertencia
        if (this.onWarning) {
            this.warningTimer = setTimeout(() => {
                this.onWarning?.(2); // 2 minutos restantes
            }, warningTimeMs);
        }
        
        // Timer de idle
        this.idleTimer = setTimeout(() => {
            this.onIdle?.();
        }, idleTimeMs);
    }
    
    private clearTimers(): void {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
    }
    
    private addEventListeners(): void {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, this.resetTimer.bind(this), true);
        });
    }
    
    private removeEventListeners(): void {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.removeEventListener(event, this.resetTimer.bind(this), true);
        });
    }
}

/**
 * Configuración de headers de seguridad para Axios
 */
export const configureSecurityHeaders = (axiosInstance: AxiosInstance): void => {
    // Interceptor para requests
    axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
        // Agregar token automáticamente
        const token = TokenManager.getInstance().getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Agregar CSRF token si está disponible
        const csrfToken = sessionStorage.getItem('csrf_token');
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        
        // Headers de seguridad
        Object.assign(config.headers, SECURITY_CONFIG.SECURITY_HEADERS);
        
        return config;
    });
    
    // Interceptor para responses
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
            // Si el token ha expirado, limpiar y redirigir
            if (error.response?.status === 401) {
                TokenManager.getInstance().clearToken();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

/**
 * Valida la entrada contra patrones comunes de inyección
 */
export const validateInput = (input: string, type: 'sql' | 'xss' | 'all' = 'all'): boolean => {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
        /(--|\/\*|\*\/|;)/,
        /(\b(OR|AND)\b.*=.*)/i
    ];
    
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
    ];
    
    const patterns = type === 'sql' ? sqlPatterns : 
                    type === 'xss' ? xssPatterns : 
                    [...sqlPatterns, ...xssPatterns];
    
    return !patterns.some(pattern => pattern.test(input));
};

export default {
    SECURITY_CONFIG,
    sanitizeInput,
    generateCSRFToken,
    validatePasswordStrength,
    TokenManager,
    IdleTimer,
    configureSecurityHeaders,
    validateInput
};
