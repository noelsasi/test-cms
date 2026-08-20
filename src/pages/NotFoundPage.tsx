import { Link } from 'react-router-dom'
import { PATH_DASHBOARD } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <Link to={PATH_DASHBOARD.root} className="text-link hover:underline">
        Back to dashboard
      </Link>
    </div>
  )
}
