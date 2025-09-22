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
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      }
    },
    server: {
      host: '0.0.0.0', // necesario para exponer fuera del contenedor
      port: 3000,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 1000,
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
        clientPort: parseInt(process.env.VITE_HMR_PORT || '81'), // puerto expuesto en host
        host: process.env.VITE_HMR_HOST || 'localhost',
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
    // Puedes agregar más ajustes específicos de desarrollo aquí si lo necesitas
  }

  return config;
})
