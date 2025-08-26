import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import type { UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Configuración base
  const config: UserConfig = {
    plugins: [react()],
    css:{
      postcss:{
        plugins:[tailwindcss, autoprefixer]
      }
    },
    server: {
      host: true,      // permite acceso desde fuera del contenedor
      port: 3000,
      strictPort: true,
      watch: {
        usePolling: true, // necesario para Windows mounts
        interval: 1000,   // intervalo de polling más conservador (1 segundo)
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/coverage/**',
          '**/*.log',
          'vite.config.ts.timestamp-*'
        ]
      },
      hmr: {
        // Configuración para HMR directo (sin proxy)
        clientPort: parseInt(process.env.VITE_HMR_PORT || '3000'),
        host: process.env.VITE_HMR_HOST || 'localhost',
        // Configuraciones adicionales para estabilidad
        timeout: 30000,
        overlay: true
      }
    },
  };

  // Configuraciones específicas para desarrollo
  if (mode === 'development' || process.env.VITE_NODE_ENV === 'development') {
    config.optimizeDeps = {
      include: ['@fdograph/rut-utilities'],
      exclude: []
    };
    
    // Deshabilitar HMR para módulos problemáticos
    config.server = {
      ...config.server,
      hmr: {
        clientPort: parseInt(process.env.VITE_HMR_PORT || '8080'),
        host: process.env.VITE_HMR_HOST || 'localhost',
        overlay: false,  // Deshabilitar overlay de errores que puede causar recargas
        timeout: 30000   // Aumentar timeout para conexiones lentas
      }
    };
  }

  return config;
})
