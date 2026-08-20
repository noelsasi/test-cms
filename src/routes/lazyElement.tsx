import { lazy, Suspense, type ComponentType, type ReactElement } from 'react'
import { PageLoader } from '@/components/ui'

/**
 * Wraps a lazy page in its own Suspense boundary, so each route shows the
 * loader only while its own chunk is in flight — a shared boundary higher up
 * would unmount the surrounding shell on every navigation.
 */
export function lazyElement(component: () => Promise<{ default: ComponentType }>): ReactElement {
  const Page = lazy(component)
  return (
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  )
}
