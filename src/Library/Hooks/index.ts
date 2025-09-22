// Exportar todos los hooks personalizados
export { useAuth } from './useAuth';
export { useFullScreen } from './useFullScreen';
export { useLoginAttempts } from './useLoginAttempts';
export { useSecureForm } from './useSecureForm';
export { useServiceWorker } from './useServiceWorker';
export { usePermissions } from './usePermissions';

// Nuevos hooks para datos del ERP
export { useCategorias, type Categoria } from './Models/useCategorias';
export { useProveedores, type Proveedor } from './Models/useProveedores';
export { useCentrosCosto, type CentroCosto } from './Models/useCentrosCosto';

// Exports por defecto para compatibilidad
export { default as useAuthDefault } from './useAuth';
export { default as useCategoriasDefault } from './Models/useCategorias';
export { default as useProveedoresDefault } from './Models/useProveedores';
export { default as useCentrosCostoDefault } from './Models/useCentrosCosto';