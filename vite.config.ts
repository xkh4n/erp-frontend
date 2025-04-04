import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
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
      usePolling: true // 🔥 necesario para que funcione hot reload con archivos montados desde Windows
    }
  },
})
