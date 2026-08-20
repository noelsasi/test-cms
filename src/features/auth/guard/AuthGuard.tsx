import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/storage'
import { PATH_AUTH } from '@/routes/paths'

/**
 * Blocks unauthenticated access. Remembers the attempted path so the user
 * lands where they intended after signing in.
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation()
  const token = storage.get(STORAGE_KEYS.token)

  if (!token) {
    return <Navigate to={PATH_AUTH.login} replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
