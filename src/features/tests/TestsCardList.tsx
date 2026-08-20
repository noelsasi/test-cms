import { Link } from 'react-router-dom'
import { formatDate, formatRelativeDate } from '@/lib/format'
import { PATH_DASHBOARD } from '@/routes/paths'
import type { Test } from '@/types'
import { DifficultyBadge } from './DifficultyBadge'
import { StatusBadge } from './StatusBadge'

interface TestsCardListProps {
  tests: Test[]
  /** Omit to hide the destructive action, matching the table's behaviour. */
  onDelete?: (test: Test) => void
  /** Rendered per card beneath the meta row, e.g. the expiry line. */
  renderExpiry: (test: Test) => React.ReactNode
}

/**
 * The narrow-screen counterpart to TestsTable. The table needs ~768px to stay
 * readable, so below `md` the same rows render as cards carrying only what
 * matters on a phone: identity, state, urgency, and the actions.
 *
 * Test type is deliberately dropped — it's secondary when scanning on mobile
 * and still lives on the test's own page.
 */
export function TestsCardList({ tests, onDelete, renderExpiry }: TestsCardListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {tests.map((test) => (
        <li
          key={test.id}
          className="rounded-[var(--radius-card)] border border-line bg-surface p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-medium text-ink-900">{test.name}</span>
              <span className="text-xs text-ink-400">{test.subject}</span>
            </div>
            {/* Time anchor for the card; the exact date stays in the tooltip. */}
            <span
              title={formatDate(test.created_at)}
              className="shrink-0 text-xs whitespace-nowrap text-ink-400"
            >
              {formatRelativeDate(test.created_at)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={test.status} />
            <DifficultyBadge difficulty={test.difficulty} />
            <span className="text-xs text-ink-500">
              {test.total_questions} {test.total_questions === 1 ? 'question' : 'questions'}
            </span>
          </div>

          {/* No expiry is the common case for drafts — omit the row rather
              than printing an em dash placeholder. */}
          {test.expiry_date && (
            <p className="mt-2 text-xs text-ink-400">Expiry: {renderExpiry(test)}</p>
          )}

          {/* Full-width tap targets rather than the table's dense inline links. */}
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <Link
              to={PATH_DASHBOARD.tests.edit(test.id)}
              className="flex-1 rounded-[var(--radius-field)] border border-line py-2 text-center text-sm font-medium text-link transition-colors hover:bg-brand-50"
            >
              Edit
            </Link>
            <Link
              to={PATH_DASHBOARD.tests.preview(test.id)}
              className="flex-1 rounded-[var(--radius-field)] border border-line py-2 text-center text-sm font-medium text-ink-700 transition-colors hover:bg-canvas"
            >
              View
            </Link>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(test)}
                aria-label={`Delete ${test.name}`}
                className="rounded-[var(--radius-field)] border border-line px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
              >
                Delete
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
