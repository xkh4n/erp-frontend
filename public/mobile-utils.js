/**
 * Script adicional para mejorar la experiencia móvil
 * Añadir este script en el index.html si se necesita funcionalidad adicional
 */

// Función para ocultar la barra de direcciones en móviles
function hideAddressBar() {
  if (window.innerHeight < window.screen.height) {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 500);
  }
}

// Función para manejar el cambio de orientación
function handleOrientationChange() {
  setTimeout(() => {
    hideAddressBar();
    
    // Actualizar altura del viewport
    const root = document.getElementById('root');
    if (root) {
      root.style.height = window.innerHeight + 'px';
    }
    
    // Forzar repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
  }, 100);
}

// Función para prevenir zoom en iOS
function preventZoom() {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
    });
    
    input.addEventListener('blur', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
        );
      }
    });
  });
}

// Función para detectar si es móvil
function isMobileDevice() {
  return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  ) || window.innerWidth <= 768;
}

// Función para configurar la aplicación en móviles
function setupMobileApp() {
  if (!isMobileDevice()) return;
  
  // Ocultar barra de direcciones
  hideAddressBar();
  
  // Configurar eventos
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
  window.addEventListener('load', hideAddressBar);
  
  // Prevenir zoom en inputs
  document.addEventListener('DOMContentLoaded', preventZoom);
  
  // Prevenir comportamientos por defecto en iOS
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', (e) => {
    // Prevenir scroll si no es necesario
    if (document.body.scrollHeight <= window.innerHeight) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Configurar altura inicial
  const root = document.getElementById('root');
  if (root) {
    root.style.height = window.innerHeight + 'px';
    root.style.minHeight = window.innerHeight + 'px';
  }
  
  // Añadir clases CSS específicas para móvil
  document.body.classList.add('mobile-device');
  
  // Configurar meta tags dinámicamente si no están presentes
  if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
    const metaCapable = document.createElement('meta');
    metaCapable.name = 'apple-mobile-web-app-capable';
    metaCapable.content = 'yes';
    document.head.appendChild(metaCapable);
  }
  
  if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
    const metaStatusBar = document.createElement('meta');
    metaStatusBar.name = 'apple-mobile-web-app-status-bar-style';
    metaStatusBar.content = 'black-translucent';
    document.head.appendChild(metaStatusBar);
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupMobileApp);
} else {
  setupMobileApp();
}

// Exportar funciones para uso manual si es necesario
window.mobileUtils = {
  hideAddressBar,
  handleOrientationChange,
  preventZoom,
  isMobileDevice,
  setupMobileApp
};
