import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isInstalling: boolean;
  isWaiting: boolean;
  isControlling: boolean;
  hasUpdate: boolean;
  registration: ServiceWorkerRegistration | null;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isInstalling: false,
    isWaiting: false,
    isControlling: false,
    hasUpdate: false,
    registration: null
  });

  useEffect(() => {
    if (!state.isSupported) {
      console.log('Service Worker no es soportado en este navegador');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isControlling: !!navigator.serviceWorker.controller
        }));

        console.log('Service Worker registrado exitosamente:', registration);

        // Escuchar cambios en el estado del service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            setState(prev => ({ ...prev, isInstalling: true }));

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                setState(prev => ({ ...prev, isInstalling: false }));
                
                if (navigator.serviceWorker.controller) {
                  // Nueva versión disponible
                  setState(prev => ({ 
                    ...prev, 
                    hasUpdate: true, 
                    isWaiting: true 
                  }));
                  console.log('Nueva versión del Service Worker disponible');
                } else {
                  // Primer registro
                  console.log('Service Worker instalado por primera vez');
                }
              }
            });
          }
        });

        // Escuchar cambios en el controlador
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setState(prev => ({
            ...prev,
            isControlling: !!navigator.serviceWorker.controller,
            hasUpdate: false,
            isWaiting: false
          }));
          console.log('Nuevo Service Worker tomó control');
          window.location.reload();
        });

      } catch (error) {
        console.error('Error al registrar Service Worker:', error);
        setState(prev => ({ ...prev, isRegistered: false }));
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  // Función para actualizar el service worker
  const updateServiceWorker = () => {
    if (state.registration && state.registration.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Función para verificar actualizaciones manualmente
  const checkForUpdates = async () => {
    if (state.registration) {
      try {
        await state.registration.update();
        console.log('Verificación de actualizaciones completada');
      } catch (error) {
        console.error('Error al verificar actualizaciones:', error);
      }
    }
  };

  return {
    ...state,
    updateServiceWorker,
    checkForUpdates
  };
};

export default useServiceWorker;
