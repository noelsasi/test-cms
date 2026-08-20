import { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader } from '@/components/ui'
import { ROUTES } from '@/lib/constants'
import { ProtectedRoute } from './ProtectedRoute'
import { NotFoundPage, protectedRoutes, publicRoutes } from './routes'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {publicRoutes.map(({ path, component: Page }) => (
            <Route key={path} path={path} element={<Page />} />
          ))}

          <Route element={<ProtectedRoute />}>
            {protectedRoutes.map(({ path, component: Page }) => (
              <Route key={path} path={path} element={<Page />} />
            ))}
          </Route>

          <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
