import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { PATH_AUTH } from '@/routes/paths'
import { selectIsAuthenticated } from '../authSlice'

/**
 * Blocks unauthenticated access. Remembers the attempted path so the user
 * lands where they intended after signing in.
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={PATH_AUTH.login} replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
