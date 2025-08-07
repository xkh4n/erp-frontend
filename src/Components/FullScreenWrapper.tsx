import React, { useEffect } from 'react';
import { useFullScreen } from '../Library/Hooks/useFullScreen';

interface FullScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const FullScreenWrapper: React.FC<FullScreenWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isMobile, viewportHeight, isStandalone } = useFullScreen({
    hideAddressBar: true,
    preventZoom: true,
    enablePWAMode: true
  });

  useEffect(() => {
    // Configurar la altura de la aplicación basada en el viewport usando CSS custom properties
    const root = document.getElementById('root');
    if (root && isMobile) {
      root.style.setProperty('--viewport-height', `${viewportHeight}px`);
      root.classList.add('mobile-viewport-height');
    } else if (root) {
      root.classList.remove('mobile-viewport-height');
    }
  }, [viewportHeight, isMobile]);

  const containerClasses = `
    ${className}
    ${isMobile ? 'fullscreen-mobile safe-area-insets mobile-touch-optimized' : ''}
    ${isStandalone ? 'standalone-mode' : ''}
    w-full
    ${isMobile ? 'h-screen' : 'min-h-screen'}
    overflow-hidden
    ${isMobile ? 'overflow-y-auto' : ''}
  `.trim();

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default FullScreenWrapper;
