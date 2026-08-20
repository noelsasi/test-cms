import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/storage'

/** Gate for authenticated screens. Remembers where the user was headed. */
export function ProtectedRoute() {
  const location = useLocation()
  const token = storage.get(STORAGE_KEYS.token)

  if (!token) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
