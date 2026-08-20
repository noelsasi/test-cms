import type { ComponentType } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { lazyElement } from './lazyElement'
import { ProtectedRoute } from './ProtectedRoute'
import { RouteErrorBoundary } from './RouteErrorBoundary'

/**
 * Declarative route config. Screens are described as data so the list stays
 * readable and can be reused for navigation, breadcrumbs, and titles later.
 */
export interface AppRoute {
  path: string
  /** Lazy import of a default-exported page component. */
  component: () => Promise<{ default: ComponentType }>
  /** Shown in breadcrumbs and the document title. */
  title: string
  /** Public routes skip the auth guard. Defaults to protected. */
  public?: boolean
}

const pages = {
  login: () => import('@/pages/LoginPage'),
  dashboard: () => import('@/pages/DashboardPage'),
  testForm: () => import('@/pages/TestFormPage'),
  questions: () => import('@/pages/QuestionsPage'),
  preview: () => import('@/pages/PreviewPage'),
  notFound: () => import('@/pages/NotFoundPage'),
}

export const appRoutes: AppRoute[] = [
  { path: ROUTES.login, component: pages.login, title: 'Login', public: true },
  { path: ROUTES.dashboard, component: pages.dashboard, title: 'Dashboard' },
  { path: ROUTES.testCreate, component: pages.testForm, title: 'Create Test' },
  { path: '/tests/:testId/edit', component: pages.testForm, title: 'Edit Test' },
  { path: '/tests/:testId/questions', component: pages.questions, title: 'Add Questions' },
  { path: '/tests/:testId/preview', component: pages.preview, title: 'Preview & Publish' },
]

function toRouteObject(route: AppRoute): RouteObject {
  return { path: route.path, element: lazyElement(route.component) }
}

/** Route objects consumed by `createBrowserRouter`. */
export const routeObjects: RouteObject[] = [
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      ...appRoutes.filter((route) => route.public).map(toRouteObject),
      {
        element: <ProtectedRoute />,
        children: appRoutes.filter((route) => !route.public).map(toRouteObject),
      },
      { path: '/', element: <Navigate to={ROUTES.dashboard} replace /> },
      { path: '*', element: lazyElement(pages.notFound) },
    ],
  },
]
