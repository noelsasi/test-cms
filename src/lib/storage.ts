/**
 * localStorage wrapper that degrades gracefully when storage is unavailable
 * (Safari private mode, disabled cookies) instead of throwing at call sites.
 */
export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Storage full or unavailable — the session simply won't persist.
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // no-op
    }
  },
}
