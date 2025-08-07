import { useEffect, useState } from 'react';

interface UseFullScreenOptions {
  hideAddressBar?: boolean;
  preventZoom?: boolean;
  enablePWAMode?: boolean;
}

export const useFullScreen = (options: UseFullScreenOptions = {}) => {
  const {
    hideAddressBar = true,
    preventZoom = true,
    enablePWAMode = true
  } = options;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    // Detectar si es un dispositivo móvil
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
      return isMobileDevice || isSmallScreen;
    };

    // Función para ocultar la barra de direcciones
    const hideAddressBarFunction = () => {
      if (!hideAddressBar) return;
      
      // Técnica 1: Scroll hacia abajo para ocultar la barra
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 500);

      // Técnica 2: Usar requestAnimationFrame para mejor timing
      requestAnimationFrame(() => {
        window.scrollTo(0, 1);
      });
    };

    // Manejar cambios de orientación y resize
    const handleResize = () => {
      const mobile = checkIfMobile();
      setViewportHeight(window.innerHeight);
      
      if (mobile && hideAddressBar) {
        hideAddressBarFunction();
      }
    };

    // Manejar orientación
    const handleOrientationChange = () => {
      setTimeout(() => {
        handleResize();
        if (isMobile && hideAddressBar) {
          hideAddressBarFunction();
        }
      }, 100);
    };

    // Prevenir zoom en inputs (iOS)
    const preventZoomOnInputs = () => {
      if (!preventZoom) return;
      
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
          }
          // Añadir clase CSS en lugar de estilo inline
          input.classList.add('prevent-zoom-focused');
        });
        
        input.addEventListener('blur', () => {
          const viewport = document.querySelector('meta[name="viewport"]');
          if (viewport) {
            viewport.setAttribute('content', 
              'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
            );
          }
          // Remover clase CSS
          input.classList.remove('prevent-zoom-focused');
        });
      });
    };

    // Configurar PWA
    const setupPWA = () => {
      if (!enablePWAMode) return;
      
      // Verificar si ya está en modo PWA
      function hasStandalone(navigator: Navigator): navigator is Navigator & { standalone: boolean } {
        return 'standalone' in navigator;
      }
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (hasStandalone(window.navigator) && window.navigator.standalone) ||
                          document.referrer.includes('android-app://');
      
      setIsFullScreen(isStandalone);
    };

    // Inicializar
    const mobile = checkIfMobile();
    setupPWA();
    
    if (mobile) {
      hideAddressBarFunction();
      preventZoomOnInputs();
    }

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Listener para cambios en modo PWA
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      mediaQuery.addEventListener('change', (e) => {
        setIsFullScreen(e.matches);
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [hideAddressBar, preventZoom, enablePWAMode, isMobile]);

  // Función para forzar pantalla completa
  const enterFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      }
    } catch (error) {
      console.warn('No se pudo entrar en modo pantalla completa:', error);
    }
  };

  // Función para salir de pantalla completa
  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (error) {
      console.warn('No se pudo salir del modo pantalla completa:', error);
    }
  };

  return {
    isFullScreen,
    isMobile,
    viewportHeight,
    enterFullScreen,
    exitFullScreen,
    isStandalone: isFullScreen
  };
};

export default useFullScreen;
