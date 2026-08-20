import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <Link to={ROUTES.dashboard} className="text-link hover:underline">
        Back to dashboard
      </Link>
    </div>
  )
}
