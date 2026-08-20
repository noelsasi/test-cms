/**
 * Centralised, validated access to build-time configuration.
 * Fails fast at startup rather than surfacing as a confusing 404 later.
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawBaseUrl) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Copy .env.example to .env and restart the dev server.',
  )
}

const isDev = import.meta.env.DEV

/**
 * In dev we call the Vite proxy at a same-origin path, because the staging API
 * returns no CORS headers for localhost. Builds use the absolute URL.
 */
const apiBaseUrl = isDev
  ? new URL(rawBaseUrl).pathname.replace(/\/$/, '')
  : rawBaseUrl.replace(/\/$/, '')

export const env = {
  apiBaseUrl,
  isDev,
} as const
