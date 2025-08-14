// Biblioteca de validaciones de seguridad para el frontend

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Función para sanitizar strings y prevenir XSS
export const sanitizeString = (input: string): string => {
    if (!input) return '';
    
    return input
        .trim()
        .replace(/[<>'"&]/g, (char) => {
            const charMap: { [key: string]: string } = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '&': '&amp;'
            };
            return charMap[char] || char;
        });
};

// Validar email
export const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
        errors.push('El correo electrónico es requerido');
    } else if (!emailRegex.test(email)) {
        errors.push('El formato del correo electrónico no es válido');
    } else if (email.length > 254) {
        errors.push('El correo electrónico es demasiado largo');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validar teléfono
export const validatePhone = (phone: string): ValidationResult => {
    const errors: string[] = [];
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Formato internacional básico
    
    if (!phone) {
        errors.push('El teléfono es requerido');
    } else {
        const cleanPhone = phone.replace(/[\s\-()]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            errors.push('El formato del teléfono no es válido');
        } else if (cleanPhone.length < 8 || cleanPhone.length > 15) {
            errors.push('El teléfono debe tener entre 8 y 15 dígitos');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validar código/serie (prevenir inyección de código)
export const validateSerialCode = (code: string): ValidationResult => {
    const errors: string[] = [];
    const codeRegex = /^[A-Z0-9\-_]{1,50}$/; // Solo letras, números, guiones y guiones bajos
    
    if (!code) {
        errors.push('El código/serie es requerido');
    } else if (!codeRegex.test(code)) {
        errors.push('El código/serie solo puede contener letras, números, guiones y guiones bajos');
    } else if (code.length > 50) {
        errors.push('El código/serie no puede exceder 50 caracteres');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validar texto general (nombres, direcciones, etc.)
export const validateText = (text: string, fieldName: string, maxLength: number = 100): ValidationResult => {
    const errors: string[] = [];
    const textRegex = /^[a-zA-Z0-9\s.,\-_#]{1,}$/; // Caracteres seguros básicos
    
    if (!text) {
        errors.push(`${fieldName} es requerido`);
    } else if (!textRegex.test(text)) {
        errors.push(`${fieldName} contiene caracteres no permitidos`);
    } else if (text.length > maxLength) {
        errors.push(`${fieldName} no puede exceder ${maxLength} caracteres`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validar IDs de MongoDB (ObjectId)
export const validateObjectId = (id: string, fieldName: string): ValidationResult => {
    const errors: string[] = [];
    const objectIdRegex = /^[a-f\d]{24}$/i;
    
    if (!id) {
        errors.push(`${fieldName} es requerido`);
    } else if (!objectIdRegex.test(id)) {
        errors.push(`${fieldName} no tiene un formato válido`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validar formulario completo de ingreso de producto
export const validateProductForm = (formData: {
    selectedSolicitud: string;
    selectedProveedor: string;
    selectedProducto: string;
    nroSerie: string;
    telefono: string;
    email: string;
    direccion: string;
    contacto: string;
    fonoContacto: string;
    condicionesPago: string;
    condicionesEntrega: string;
    condicionesDespacho: string;
}): ValidationResult => {
    const allErrors: string[] = [];
    
    // Validar IDs
    const solicitudValidation = validateObjectId(formData.selectedSolicitud, 'Solicitud');
    const proveedorValidation = validateObjectId(formData.selectedProveedor, 'Proveedor');
    const productoValidation = validateObjectId(formData.selectedProducto, 'Producto');
    
    allErrors.push(...solicitudValidation.errors);
    allErrors.push(...proveedorValidation.errors);
    allErrors.push(...productoValidation.errors);
    
    // Validar código/serie
    const serieValidation = validateSerialCode(formData.nroSerie);
    allErrors.push(...serieValidation.errors);
    
    // Validar email y teléfonos
    const emailValidation = validateEmail(formData.email);
    const phoneValidation = validatePhone(formData.telefono);
    const contactPhoneValidation = validatePhone(formData.fonoContacto);
    
    allErrors.push(...emailValidation.errors);
    allErrors.push(...phoneValidation.errors);
    allErrors.push(...contactPhoneValidation.errors);
    
    // Validar textos
    const direccionValidation = validateText(formData.direccion, 'Dirección', 200);
    const contactoValidation = validateText(formData.contacto, 'Contacto', 100);
    const pagoValidation = validateText(formData.condicionesPago, 'Condiciones de Pago', 150);
    const entregaValidation = validateText(formData.condicionesEntrega, 'Condiciones de Entrega', 150);
    const despachoValidation = validateText(formData.condicionesDespacho, 'Condiciones de Despacho', 150);
    
    allErrors.push(...direccionValidation.errors);
    allErrors.push(...contactoValidation.errors);
    allErrors.push(...pagoValidation.errors);
    allErrors.push(...entregaValidation.errors);
    allErrors.push(...despachoValidation.errors);
    
    return {
        isValid: allErrors.length === 0,
        errors: allErrors
    };
};

// Rate limiting básico para prevenir spam
class RateLimiter {
    private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
    private maxAttempts: number;
    private windowMs: number;
    
    constructor(maxAttempts: number = 5, windowMs: number = 60000) { // 5 intentos por minuto
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }
    
    isAllowed(identifier: string): boolean {
        const now = Date.now();
        const attemptData = this.attempts.get(identifier);
        
        if (!attemptData) {
            this.attempts.set(identifier, { count: 1, lastAttempt: now });
            return true;
        }
        
        if (now - attemptData.lastAttempt > this.windowMs) {
            // Reset window
            this.attempts.set(identifier, { count: 1, lastAttempt: now });
            return true;
        }
        
        if (attemptData.count >= this.maxAttempts) {
            return false;
        }
        
        attemptData.count++;
        attemptData.lastAttempt = now;
        return true;
    }
}

export const rateLimiter = new RateLimiter();
