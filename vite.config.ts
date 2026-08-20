import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  // Missing env is reported at runtime by src/lib/env.ts, so don't throw here.
  const apiUrl = env.VITE_API_BASE_URL
  const target = apiUrl ? new URL(apiUrl).origin : undefined

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    server: {
      // The staging API sends no `access-control-allow-origin`, so the browser
      // blocks direct calls from localhost. Proxying keeps dev same-origin;
      // production builds hit VITE_API_BASE_URL directly.
      proxy: target ? { '/api': { target, changeOrigin: true, secure: true } } : undefined,
    },
  }
})
