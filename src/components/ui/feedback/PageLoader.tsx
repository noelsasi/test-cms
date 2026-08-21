import { Spinner } from '../primitives/Spinner'

/**
 * Suspense fallback for lazily loaded routes. Sized to fill the viewport so
 * the layout does not collapse and jump when the real screen mounts.
 */
export function PageLoader() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
      <Spinner className="size-8" />
      <p className="text-sm text-ink-500">Loading…</p>
    </div>
  )
}
