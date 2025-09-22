/**
 * Sistema dinámico de permisos para el frontend
 * Los permisos se cargan desde el backend y se almacenan en el contexto de autenticación
 */

/**
 * Interfaz para permisos dinámicos
 */
export interface Permission {
    name: string;
    description: string;
    resource: string;
    action: string;
    isActive: boolean;
}

/**
 * Cache local de permisos válidos
 * Se actualiza cuando el usuario se autentica
 */
let validPermissions: string[] = [];

/**
 * Actualiza la lista de permisos válidos
 * Debe ser llamado cuando el usuario se autentica
 */
export const updateValidPermissions = (permissions: string[]): void => {
    validPermissions = permissions;
};

/**
 * Obtiene la lista de permisos válidos
 */
export const getValidPermissions = (): string[] => {
    return validPermissions;
};

/**
 * Verifica si un permiso es válido
 */
export const isValidPermission = (permission: string): boolean => {
    return validPermissions.includes(permission);
};

/**
 * Mapeo de rutas a permisos requeridos del frontend
 * Utiliza strings dinámicos que deben existir en la base de datos
 */
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
    // Gestión de Usuarios y Registro
    '/registro': ['manage_users'],
    
    // Funcional - Pantallas
    '/asignarpantalla': ['update'],
    '/crearpantalla': ['create'],
    
    // Funcional - Procesos
    '/crearproceso': ['manage_names'],
    
    // Adquisiciones - Proveedores
    '/crear_proveedor': ['create'],
    
    // Adquisiciones - Productos
    '/crear_producto': ['create'],
    '/ingresos': ['create'],
    '/agregar_producto': ['create'],
    '/devolucion': ['update'], // Baja de productos
    
    // Adquisiciones - Solicitudes
    '/crear_solicitud': ['create'],
    '/autorizar_solicitud': ['update'],
    
    // Adquisiciones - Categorías
    '/crear_categoria': ['create'],
    
    // Adquisiciones - Asignaciones
    '/asignacion': ['create'],
    
    // Inventario
    '/inventario_ingresos': ['read'],
    '/consultar_inventario': ['read'],
} as const;