import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Table, type Column, type TablePaginationConfig } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatDate, formatRelativeDate } from '@/lib/format'
import { PATH_DASHBOARD } from '@/routes/paths'
import type { Test } from '@/types'
import { DifficultyBadge } from './DifficultyBadge'
import { StatusBadge } from './StatusBadge'

/**
 * Expiry is the column people scan for urgency, so a past date is called out as
 * "Expired" in danger tone rather than reading as just another relative date.
 */
function ExpiryCell({ test }: { test: Test }) {
  if (!test.expiry_date) return <span className="text-ink-400">—</span>

  const hasExpired = new Date(test.expiry_date).getTime() < Date.now()

  return (
    <span
      title={formatDate(test.expiry_date)}
      className={cn(hasExpired ? 'font-medium text-danger' : 'text-ink-500')}
    >
      {formatRelativeDate(test.expiry_date)}
    </span>
  )
}

function buildColumns(onDelete?: (test: Test) => void): Column<Test>[] {
  return [
    {
      key: 'name',
      header: 'Name',
      cellClassName: 'max-w-xs',
      render: (test) => (
        <div className="flex flex-col gap-0.5">
          <span className="truncate font-medium text-ink-900" title={test.name}>
            {test.name}
          </span>
          <span className="text-xs text-ink-400">{test.subject}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (test) => (
        <span className="inline-flex items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-ink-700 capitalize">
          {test.type}
        </span>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (test) => <DifficultyBadge difficulty={test.difficulty} />,
    },
    {
      key: 'questions',
      header: 'Questions',
      headerClassName: 'text-right',
      cellClassName: 'text-right tabular-nums font-medium text-ink-900',
      render: (test) => test.total_questions,
    },
    { key: 'status', header: 'Status', render: (test) => <StatusBadge status={test.status} /> },
    {
      key: 'created',
      header: 'Created',
      cellClassName: 'whitespace-nowrap text-ink-500',
      // Relative reads faster when scanning; the exact date stays in the tooltip.
      render: (test) => (
        <span title={formatDate(test.created_at)}>{formatRelativeDate(test.created_at)}</span>
      ),
    },
    {
      key: 'expiring',
      header: 'Expiring',
      cellClassName: 'whitespace-nowrap',
      render: (test) => <ExpiryCell test={test} />,
    },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (test) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={PATH_DASHBOARD.tests.edit(test.id)}
            className="rounded-[var(--radius-field)] px-2.5 py-1.5 text-sm font-medium text-link transition-colors hover:bg-brand-50"
          >
            Edit
          </Link>
          <Link
            to={PATH_DASHBOARD.tests.preview(test.id)}
            className="rounded-[var(--radius-field)] px-2.5 py-1.5 text-sm font-medium text-ink-500 transition-colors hover:bg-canvas hover:text-ink-900"
          >
            View
          </Link>
          {/* Read-only surfaces (e.g. the dashboard) omit the handler and
              therefore the destructive action. */}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(test)}
              className="rounded-[var(--radius-field)] px-2.5 py-1.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ]
}

interface TestsTableProps {
  tests: Test[]
  /** Omit to hide the Delete action, e.g. on the dashboard's recent list. */
  onDelete?: (test: Test) => void
  isLoading?: boolean
  emptyState?: ReactNode
  pagination?: TablePaginationConfig | false
  footerNote?: ReactNode
}

export function TestsTable({
  tests,
  onDelete,
  isLoading,
  emptyState,
  pagination,
  footerNote,
}: TestsTableProps) {
  return (
    <Table
      columns={buildColumns(onDelete)}
      rows={tests}
      getRowId={(test) => test.id}
      isLoading={isLoading}
      loadingLabel="Loading tests…"
      emptyState={emptyState}
      pagination={pagination}
      minWidthClassName="min-w-3xl"
      itemNoun="tests"
      footerNote={footerNote}
    />
  )
}
