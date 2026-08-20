import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { ROUTES } from '@/lib/constants'

export interface RouteConfig {
  path: string
  component: LazyExoticComponent<ComponentType>
}

/** Reachable without a token. */
export const publicRoutes: RouteConfig[] = [
  { path: ROUTES.login, component: lazy(() => import('@/pages/LoginPage')) },
]

/** Rendered behind ProtectedRoute — a token is required. */
export const protectedRoutes: RouteConfig[] = [
  { path: ROUTES.dashboard, component: lazy(() => import('@/pages/DashboardPage')) },
  { path: ROUTES.testCreate, component: lazy(() => import('@/pages/TestFormPage')) },
  { path: '/tests/:testId/edit', component: lazy(() => import('@/pages/TestFormPage')) },
  { path: '/tests/:testId/questions', component: lazy(() => import('@/pages/QuestionsPage')) },
  { path: '/tests/:testId/preview', component: lazy(() => import('@/pages/PreviewPage')) },
]

export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
