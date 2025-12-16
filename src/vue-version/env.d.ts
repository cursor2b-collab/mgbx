/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'staging'
  readonly VITE_ENABLE_GOOGLE_LOGIN: string
  readonly VITE_ENABLE_GITHUB_LOGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
