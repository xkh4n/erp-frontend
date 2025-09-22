# Hooks Personalizados para Datos del ERP

Este conjunto de hooks personalizados te permite reutilizar la lógica de carga de datos comunes en todo el sistema ERP, eliminando la duplicación de código.

## Hooks Disponibles

### 1. `useCategorias`
Hook para cargar y manejar categorías de productos.

```typescript
import { useCategorias } from '../../../../Library/Hooks/useCategorias';

const MiComponente = () => {
    const { categorias, loading, error, refetch } = useCategorias();
    
    return (
        <select disabled={loading}>
            <option value="">Seleccione una categoría</option>
            {categorias.map(categoria => (
                <option key={categoria._id} value={categoria.codigo}>
                    {categoria.nombre}
                </option>
            ))}
        </select>
    );
};
```

### 2. `useProveedores`
Hook para cargar y manejar proveedores.

```typescript
import { useProveedores } from '../../../../Library/Hooks/useProveedores';

const MiComponente = () => {
    const { proveedores, loading, error, refetch } = useProveedores();
    
    return (
        <select disabled={loading}>
            <option value="">Seleccione un proveedor</option>
            {proveedores.map(proveedor => (
                <option key={proveedor._id} value={proveedor._id}>
                    {proveedor.razonSocial}
                </option>
            ))}
        </select>
    );
};
```

### 3. `useCentrosCosto`
Hook para cargar y manejar centros de costo.

```typescript
import { useCentrosCosto } from '../../../../Library/Hooks/useCentrosCosto';

const MiComponente = () => {
    const { centrosCostos, loading, error, refetch } = useCentrosCosto();
    
    return (
        <select disabled={loading}>
            <option value="">Seleccione un centro de costo</option>
            {centrosCostos.map(centro => (
                <option key={centro._id} value={centro._id}>
                    {centro.nombre}
                </option>
            ))}
        </select>
    );
};
```

## Propiedades Retornadas

Todos los hooks retornan un objeto con las siguientes propiedades:

- **`datos`**: Array con los datos cargados (categorias, proveedores, centrosCostos)
- **`loading`**: Boolean que indica si se están cargando los datos
- **`error`**: String con el mensaje de error o null si no hay errores
- **`refetch`**: Función para recargar los datos manualmente

## Características

### ✅ Ventajas
- **Reutilizable**: Usa el mismo hook en múltiples componentes
- **Automático**: Los datos se cargan automáticamente cuando el usuario está autenticado
- **Ordenado**: Los datos vienen pre-ordenados alfabéticamente
- **Manejo de errores**: Errores manejados automáticamente con el sistema existente
- **Optimizado**: Incluye loading states y manejo de dependencias

### 🔄 Migración desde useEffect

**Antes (código duplicado):**
```typescript
const [categorias, setCategorias] = useState<Categoria[]>([]);

useEffect(() => {
    const fetchCategorias = async () => {
        try {
            if (!isAuthenticated || !accessToken) return;
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/categoria/todos`,
                {},
                { headers: { 'Authorization': `Bearer ${accessToken}` } }
            );
            
            setCategorias(response.data.data.sort((a, b) => 
                a.nombre.localeCompare(b.nombre)) || []);
        } catch (error) {
            handleErrorWithContext(error);
        }
    };
    
    if (isAuthenticated) fetchCategorias();
}, [isAuthenticated, accessToken, handleErrorWithContext]);
```

**Después (usando hook):**
```typescript
const { categorias, loading, error } = useCategorias();
```

## Importación

Puedes importar los hooks de forma individual o desde el archivo de barril:

```typescript
// Importación individual
import { useCategorias } from '../../../../Library/Hooks/useCategorias';
import { useProveedores } from '../../../../Library/Hooks/useProveedores';

// Importación desde el barril
import { useCategorias, useProveedores, useCentrosCosto } from '../../../../Library/Hooks';
```

## Ejemplo Completo de Migración

```typescript
// ANTES: Con múltiples useEffect
export default function MiVistaAntes() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [centrosCostos, setCentrosCostos] = useState<CentroCosto[]>([]);
    const { accessToken, isAuthenticated } = useAuth();
    
    // 3 useEffect separados... (código duplicado)
    useEffect(() => { /* cargar categorias */ }, []);
    useEffect(() => { /* cargar proveedores */ }, []);
    useEffect(() => { /* cargar centros */ }, []);
    
    return (/* JSX */);
}

// DESPUÉS: Con hooks personalizados
export default function MiVistaDespues() {
    const { categorias, loading: loadingCategorias } = useCategorias();
    const { proveedores, loading: loadingProveedores } = useProveedores();
    const { centrosCostos, loading: loadingCentros } = useCentrosCosto();
    
    return (/* JSX */);
}
```

## Notas Importantes

1. **Autenticación**: Los hooks automáticamente verifican si el usuario está autenticado antes de hacer las peticiones.

2. **Recarga**: Si necesitas recargar los datos manualmente, usa la función `refetch` retornada por el hook.

3. **Tipos**: Todos los hooks incluyen types de TypeScript para mejor desarrollo.

4. **Performance**: Los hooks están optimizados con `useCallback` y `useMemo` donde es necesario.

5. **Consistencia**: Todos los hooks siguen la misma estructura y convenciones.