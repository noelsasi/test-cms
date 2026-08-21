import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Alert, Button, ConfirmDialog, EmptyState, Input, useToast } from '@/components/ui'
import { StatusIcon, TestsTable, useDeleteTestMutation, useGetTestsQuery } from '@/features/tests'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'
import type { Test, TestStatus } from '@/types'

const STATUS_FILTERS: { label: string; value: NonNullable<TestStatus> | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Live', value: 'live' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Expired', value: 'expired' },
]

export default function TestsListPage() {
  const { data: tests, isLoading, isFetching, isError, error, refetch } = useGetTestsQuery()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TestStatus | 'all'>('all')
  const [pendingDelete, setPendingDelete] = useState<Test | null>(null)
  const [deleteTest, deleteState] = useDeleteTestMutation()
  const { showToast } = useToast()

  async function handleConfirmDelete() {
    if (!pendingDelete) return

    try {
      await deleteTest(pendingDelete.id).unwrap()
      // Named, because a filtered or paginated table may not have been showing
      // the deleted row in the first place.
      showToast(`"${pendingDelete.name}" was deleted.`)
      setPendingDelete(null)
    } catch {
      // Keep the dialog open; the error is surfaced above the table.
    }
  }

  const visibleTests = useMemo(() => {
    if (!tests) return []
    const query = search.trim().toLowerCase()

    return tests.filter((test) => {
      // A null status is an unsaved draft, so it belongs under the Draft filter.
      const matchesStatus = status === 'all' || (test.status ?? 'draft') === status
      const matchesQuery =
        !query ||
        test.name.toLowerCase().includes(query) ||
        test.subject.toLowerCase().includes(query)

      return matchesStatus && matchesQuery
    })
  }, [tests, search, status])

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Test Creation' }, { label: 'All Tests' }]}
        title="Tests"
        actions={
          <Link to={PATH_DASHBOARD.tests.create}>
            <Button>Create New Test</Button>
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by test name or subject"
          aria-label="Search tests"
          className="w-full sm:w-80"
        />
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={String(filter.value)}
              variant={status === filter.value ? 'primary' : 'secondary'}
              onClick={() => setStatus(filter.value)}
              size="sm"
              className="gap-1.5"
            >
              {filter.value !== 'all' && <StatusIcon status={filter.value} />}
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {deleteState.error && (
        <Alert className="mb-4">
          {getApiErrorMessage(deleteState.error, 'Could not delete the test.')}
        </Alert>
      )}

      {isError && !tests ? (
        <Alert>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{getApiErrorMessage(error, 'Could not load tests.')}</span>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Alert>
      ) : (
        <>
          <TestsTable
            key={`${search}|${status}`}
            tests={visibleTests}
            onDelete={setPendingDelete}
            isLoading={isLoading && !tests}
            emptyState={
              <EmptyState
                title="No tests match your filters"
                description="Try a different search term, or create a new test."
              />
            }
            pagination={{ pageSize: 10 }}
            footerNote={isFetching ? ' · refreshing…' : null}
          />
        </>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Delete "${pendingDelete.name}"?`}
          description="This also deletes every question in the test. This cannot be undone."
          confirmLabel="Delete Test"
          isConfirming={deleteState.isLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  )
}
