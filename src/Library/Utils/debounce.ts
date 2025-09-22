// Utility para debounce - crear en src/Library/Utils/debounce.ts

/**
 * Crea una función debounced que retrasa la invocación de la función
 * hasta después de que hayan pasado los milisegundos de espera desde la última vez que se invocó.
 */
export function debounce<T extends (...args: never[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}

/**
 * Throttle - Limita la ejecución de una función a una vez cada 'limit' milisegundos
 */
export function throttle<T extends (...args: never[]) => unknown>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}