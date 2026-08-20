import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

/**
 * Turns an RTK Query error into something worth showing a user. The API sends
 * `{ status: 'error', message }`, but network failures and 5xx pages don't, so
 * every shape falls back to a readable sentence.
 */
export function getApiErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!error) return fallback

  if ('status' in error) {
    if (error.status === 'FETCH_ERROR') {
      return 'Could not reach the server. Check your connection and try again.'
    }

    const data: unknown = 'data' in error ? error.data : undefined
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object' && 'message' in data) {
      const { message } = data as { message: unknown }
      if (typeof message === 'string' && message.trim()) return message
    }

    if (error.status === 401) return 'Invalid User ID or password.'
    return fallback
  }

  return error.message ?? fallback
}
