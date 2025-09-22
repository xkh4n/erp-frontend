// Hooks para datos básicos del sistema
export { useCategorias, type Categoria } from './useCategorias';
export { useProveedores, type Proveedor } from './useProveedores';
export { useCentrosCosto, type CentroCosto } from './useCentrosCosto';
export { 
    useInventarioEstadisticas, 
    type EstadisticasInventario, 
    type EstadisticaCategoria, 
    type EstadisticaEstado, 
    type EstadisticaUbicacion, 
    type ResumenInventario 
} from './useInventarioEstadisticas';