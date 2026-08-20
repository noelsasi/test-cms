import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { ProtectedRoute } from './ProtectedRoute'

// Route-level code splitting keeps the login bundle small.
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TestFormPage = lazy(() => import('@/pages/TestFormPage'))
const QuestionsPage = lazy(() => import('@/pages/QuestionsPage'))
const PreviewPage = lazy(() => import('@/pages/PreviewPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function RouteFallback() {
  return <div className="p-10 text-sm text-ink-500">Loading…</div>
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path={ROUTES.login} element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.testCreate} element={<TestFormPage />} />
            <Route path="/tests/:testId/edit" element={<TestFormPage />} />
            <Route path="/tests/:testId/questions" element={<QuestionsPage />} />
            <Route path="/tests/:testId/preview" element={<PreviewPage />} />
          </Route>

          <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
