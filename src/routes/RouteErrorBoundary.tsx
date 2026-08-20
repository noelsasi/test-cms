import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

/**
 * Catches render and lazy-import failures for a route subtree.
 * A failed chunk download is the common case here — usually a stale tab
 * after a redeploy — so reloading is offered as the primary action.
 */
export function RouteErrorBoundary() {
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
