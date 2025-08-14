// ========================================
// EXPORTACIONES DE COMPONENTES DE SEGURIDAD
// ========================================

/**
 * Este archivo centraliza las exportaciones de todos los componentes
 * de seguridad reutilizables del sistema.
 * 
 * IMPORTANTE: Solo descomenta las exportaciones de los componentes
 * que hayas creado y verificado que funcionan correctamente.
 */

// ========================================
// COMPONENTES UI CONFIRMADOS
// ========================================

// ✅ Componente de input con validación en tiempo real
export { ValidatedInput } from '../ValidatedInput';

// ✅ Componente de botón con estados de seguridad  
export { SecureButton } from '../SecureButton';

// ✅ Indicador visual de estado de seguridad
export { SecurityIndicator } from '../SecurityIndicator';

// ========================================
// COMPONENTES EN DESARROLLO
// ========================================

// 🚧 Descomenta cuando estén listos:

// Formulario seguro completo
// export { SecureForm } from '../SecureForm';

// Rutas protegidas por autenticación
// export { ProtectedRoute, GuestRoute } from '../ProtectedRoute';

// ========================================
// HOOKS DE SEGURIDAD 
// ========================================

// 🚧 Descomenta cuando estén creados:

// Hook para manejo de intentos de login
// export { useLoginAttempts } from '../../Library/Hooks/useLoginAttempts';

// Hook para formularios seguros
// export { useSecureForm } from '../../Library/Hooks/useSecureForm';

// Hook de autenticación
// export { useAuth } from '../../Library/Hooks/useAuth';

// ========================================
// UTILIDADES DE SEGURIDAD
// ========================================

// 🚧 Descomenta cuando estén creadas:

// Utilidades de seguridad del sistema
// export {
//     SECURITY_CONFIG,
//     sanitizeInput,
//     generateCSRFToken,
//     validatePasswordStrength,
//     TokenManager,
//     IdleTimer,
//     configureSecurityHeaders,
//     validateInput
// } from '../../Library/Security';

// ========================================
// SISTEMA DE NOTIFICACIONES
// ========================================

// ✅ Sistema de Toast (ya existe en el proyecto)
export {
    Toast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    showApprovalToast,
    showRejectionToast,
    showPendingToast,
    showProcessingToast,
    showCompletedToast
} from '../Toast';

// ========================================
// INSTRUCCIONES DE USO
// ========================================

/**
 * Para usar estos componentes en tus formularios:
 * 
 * import { 
 *   ValidatedInput, 
 *   SecureButton, 
 *   SecurityIndicator,
 *   showSuccessToast,
 *   showErrorToast 
 * } from '../Components/Security';
 * 
 * Ejemplo básico:
 * 
 * <ValidatedInput
 *   name="email"
 *   type="email"
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   validator={IsEmail}
 *   autoLowercase={true}
 *   required={true}
 * />
 * 
 * <SecureButton
 *   isLoading={isLoading}
 *   isBlocked={isBlocked}
 *   normalText="Enviar"
 *   variant="primary"
 * />
 */
