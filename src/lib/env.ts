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

export const env = {
  apiBaseUrl: rawBaseUrl.replace(/\/$/, ''),
  isDev: import.meta.env.DEV,
} as const
