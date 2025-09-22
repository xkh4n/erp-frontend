# Solución para Rate Limiting (Error 429)

## 🚨 **Problema identificado:**
Al ingresar solicitudes con varios productos, se generan múltiples peticiones rápidas al endpoint `/api/1.0/solicitud/aprobadas`, causando que el rate limiter del backend bloquee las peticiones con error 429 "Too Many Requests".

## 🔍 **Causa raíz:**
En `src/Views/Adquisiciones/Productos/Ingreso/index.tsx`, línea ~188:
- Al completar un producto se llama `recargarSolicitudes()`
- Al finalizar recepciones también se llama `recargarSolicitudes()`
- Esto puede generar múltiples llamadas en segundos

## ✅ **Soluciones implementadas:**

### 1. **Delay adicional entre peticiones**
```typescript
// Antes
setTimeout(() => {
    handlerGuardarRecepciones();
    recargarSolicitudes(); // Inmediato
}, 2000);

// Después  
setTimeout(() => {
    handlerGuardarRecepciones();
    setTimeout(() => {
        recargarSolicitudes(); // Con delay de 1 segundo adicional
    }, 1000);
}, 2000);
```

### 2. **Manejo específico de error 429**
```typescript
if (error.response?.status === 429) {
    toast.warning("Demasiadas peticiones. Reintentando en 3 segundos...");
    setTimeout(() => {
        recargarSolicitudes();
    }, 3000);
    return;
}
```

### 3. **Hook personalizado para rate limiting**
Creado `useRateLimitedRequest` que:
- ✅ Previene múltiples llamadas rápidas
- ✅ Maneja automáticamente errores 429
- ✅ Implementa reintentos con delay exponencial
- ✅ Es reutilizable en toda la aplicación

### 4. **Utilidades de debounce/throttle**
Creadas en `src/Library/Utils/debounce.ts` para controlar frecuencia de llamadas.

## 🚀 **Uso del hook useRateLimitedRequest:**

```typescript
import { useRateLimitedRequest } from '../../../../Library/Hooks/useRateLimitedRequest';

const MyComponent = () => {
    const { executeRequest } = useRateLimitedRequest({
        minDelay: 1000,    // Mínimo 1 segundo entre peticiones
        retryDelay: 3000,  // Esperar 3 segundos antes de reintentar 429
        maxRetries: 3      // Máximo 3 reintentos
    });

    const recargarSolicitudes = useCallback(async () => {
        await executeRequest(
            async () => {
                const response = await axios.post('/api/solicitud/aprobadas', {}, {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                setSolicitud(response.data.data || []);
                return response.data;
            },
            () => {
                toast.warning("Demasiadas peticiones. Reintentando...");
            }
        );
    }, [executeRequest, accessToken]);
};
```

## 📝 **Próximos pasos recomendados:**

1. **Aplicar el hook a todas las peticiones críticas:**
   - ✅ `recargarSolicitudes()`
   - ⏳ `recargarDetalleSolicitud()`
   - ⏳ Otras peticiones de carga de datos

2. **Optimizar el backend:**
   - Revisar configuración del rate limiter
   - Considerar aumentar límites para usuarios autenticados
   - Implementar cache para datos que no cambian frecuentemente

3. **Implementar indicadores de estado:**
   - Loading states durante reintentos
   - Mensajes informativos para el usuario
   - Disable de botones durante procesamiento

## 🎯 **Resultado esperado:**
- ❌ Sin más errores 429
- ✅ Experiencia de usuario fluida
- ✅ Peticiones controladas y espaciadas
- ✅ Reintentos automáticos transparentes