import { Navigate } from 'react-router-dom'
import { LoginForm, LoginIllustration, selectIsAuthenticated } from '@/features/auth'
import { useAppSelector } from '@/app/hooks'
import { Logo } from '@/components/ui'
import { PATH_AFTER_LOGIN } from '@/routes/paths'

export default function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // Signed-in users have no business on this screen.
  if (isAuthenticated) return <Navigate to={PATH_AFTER_LOGIN} replace />

  return (
    <main className="grid min-h-[100dvh] grid-cols-1 bg-canvas p-4 lg:grid-cols-2 lg:gap-8 lg:p-8">
      <div className="hidden items-center justify-center lg:flex">
        <LoginIllustration />
      </div>

      <div className="flex items-center justify-center rounded-[var(--radius-card)] border border-brand-200 bg-surface px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Logo className="h-10" />

          <h1 className="mt-10 text-2xl font-bold text-ink-900">Login</h1>
          <p className="mt-3 text-sm text-ink-500">Use your company provided Login credentials</p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  )
}
