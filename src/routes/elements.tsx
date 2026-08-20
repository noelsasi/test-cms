import { lazy, Suspense, type ComponentType } from 'react'
import { PageLoader } from '@/components/ui'

function Loadable<P extends object>(Component: ComponentType<P>) {
  return function LoadableComponent(props: P) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

export const LoginPage = Loadable(lazy(() => import('@/pages/LoginPage')))
export const DashboardPage = Loadable(lazy(() => import('@/pages/DashboardPage')))
export const TestFormPage = Loadable(lazy(() => import('@/pages/TestFormPage')))
export const QuestionsPage = Loadable(lazy(() => import('@/pages/QuestionsPage')))
export const PreviewPage = Loadable(lazy(() => import('@/pages/PreviewPage')))
export const NotFoundPage = Loadable(lazy(() => import('@/pages/NotFoundPage')))
