import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import Routes from './Routes'
import { AuthProvider } from './Library/Context/AuthContext'

// Configurar título de la aplicación desde variable de entorno
if (import.meta.env.VITE_APP_TITLE) {
  document.title = import.meta.env.VITE_APP_TITLE;
}

// Registrar Service Worker para PWA solo en producción (deshabilitado temporalmente por SSL)
if ('serviceWorker' in navigator && import.meta.env.PROD && import.meta.env.VITE_ENABLE_HTTPS === 'true') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW falló al registrarse: ', registrationError);
      });
  });
}

// Componente wrapper condicional para StrictMode
const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // En desarrollo, deshabilitamos StrictMode para evitar el doble montaje
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    return <>{children}</>;
  }
  
  // En producción y otros entornos, usamos StrictMode
  return <StrictMode>{children}</StrictMode>;
};

createRoot(document.getElementById('root')!).render(
    <AppWrapper>
        <AuthProvider>
            <Routes />
        </AuthProvider>
    </AppWrapper>
)
