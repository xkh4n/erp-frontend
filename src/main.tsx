import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import Routes from './Routes'
import { AuthProvider } from './Library/Context/AuthContext'

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
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

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Routes />
        </AuthProvider>
    </StrictMode>,
)
