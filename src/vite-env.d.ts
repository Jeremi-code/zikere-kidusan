/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_PLAUSIBLE_SRC?: string
  readonly VITE_UMAMI_WEBSITE_ID?: string
  readonly VITE_UMAMI_SRC?: string
  readonly VITE_CLOUDFLARE_BEACON_TOKEN?: string
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.json' {
  const value: any
  export default value
}
