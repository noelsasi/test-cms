import { lazy, Suspense, type ComponentType, type ReactElement } from 'react'
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useRouteError,
  type RouteObject,
} from 'react-router-dom'
import { PageLoader } from '@/components/ui'
import { ROUTES, STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/storage'

/* -------------------------------------------------------------------------- */
/* Route table                                                                */
/* -------------------------------------------------------------------------- */

export interface AppRoute {
  path: string
  /** Lazy import of a default-exported page component. */
  component: () => Promise<{ default: ComponentType }>
  /** Shown in breadcrumbs and the document title. */
  title: string
  /** Public routes skip the auth guard. Defaults to protected. */
  public?: boolean
}

/**
 * Every screen in the app, described as data. Adding a route is one entry —
 * the guard, lazy loading, and error boundary below apply automatically.
 */
export const appRoutes: AppRoute[] = [
  {
    path: ROUTES.login,
    component: () => import('@/pages/LoginPage'),
    title: 'Login',
    public: true,
  },
  { path: ROUTES.dashboard, component: () => import('@/pages/DashboardPage'), title: 'Dashboard' },
  {
    path: ROUTES.testCreate,
    component: () => import('@/pages/TestFormPage'),
    title: 'Create Test',
  },
  {
    path: '/tests/:testId/edit',
    component: () => import('@/pages/TestFormPage'),
    title: 'Edit Test',
  },
  {
    path: '/tests/:testId/questions',
    component: () => import('@/pages/QuestionsPage'),
    title: 'Add Questions',
  },
  {
    path: '/tests/:testId/preview',
    component: () => import('@/pages/PreviewPage'),
    title: 'Preview & Publish',
  },
]

/* -------------------------------------------------------------------------- */
/* Guard + error boundary                                                     */
/* -------------------------------------------------------------------------- */

/** Redirects to login while remembering where the user was headed. */
function ProtectedRoute() {
  const location = useLocation()

  if (!storage.get(STORAGE_KEYS.token)) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

/**
 * Catches render and lazy-import failures. A failed chunk download is the
 * common case — usually a stale tab after a redeploy — so reload comes first.
 */
function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  const detail = error instanceof Error ? error.message : 'This screen failed to load.'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
      <p className="max-w-md text-sm text-ink-500">{detail}</p>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-[var(--radius-field)] bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Reload page
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.dashboard)}
          className="rounded-[var(--radius-field)] border border-line px-4 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Router                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Each route gets its own Suspense boundary so only the content area shows the
 * loader — a shared boundary would unmount the app shell on every navigation.
 */
function lazyElement(component: AppRoute['component']): ReactElement {
  const Page = lazy(component)
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  )
}

const toRouteObject = (route: AppRoute): RouteObject => ({
  path: route.path,
  element: lazyElement(route.component),
})

const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      ...appRoutes.filter((route) => route.public).map(toRouteObject),
      {
        element: <ProtectedRoute />,
        children: appRoutes.filter((route) => !route.public).map(toRouteObject),
      },
      { path: '/', element: <Navigate to={ROUTES.dashboard} replace /> },
      { path: '*', element: lazyElement(() => import('@/pages/NotFoundPage')) },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
