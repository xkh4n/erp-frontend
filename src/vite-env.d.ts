/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_NODE_ENV: string
  readonly VITE_ENABLE_HTTPS: string
  // Agrega más variables según necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
