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
 * The staging API returns no `access-control-allow-origin`, so a browser blocks
 * any direct cross-origin call to it. Both environments therefore talk to a
 * same-origin `/api` path and let a server-side proxy forward the request,
 * where CORS does not apply: Vite's `server.proxy` in dev, and the rewrite in
 * `vercel.json` once deployed.
 *
 * Only the path is kept, so the request stays on the current origin. If the API
 * ever sends proper CORS headers, dropping this and using `rawBaseUrl` directly
 * is all that's needed.
 */
const apiBaseUrl = new URL(rawBaseUrl).pathname.replace(/\/$/, '')

export const env = {
  apiBaseUrl,
  isDev,
} as const
