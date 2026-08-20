import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { PageHeader } from '@/components/layout'
import { Alert, Button, EmptyState } from '@/components/ui'
import { selectCurrentUser } from '@/features/auth'
import {
  BreakdownBar,
  CoveragePanel,
  DashboardCard,
  DashboardSkeleton,
  DifficultyStats,
  StatCard,
  buildDashboardMetrics,
  buildSubjectCoverage,
  type BreakdownSegment,
} from '@/features/dashboard'
import { TestsTable, useGetTestsQuery } from '@/features/tests'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'

/** Matches the tones StatusBadge already uses, so the two screens agree. */
const STATUS_COLORS: Record<string, string> = {
  live: 'bg-success',
  scheduled: 'bg-accent-amber',
  draft: 'bg-ink-400',
  unpublished: 'bg-brand-400',
  expired: 'bg-danger',
}

function firstName(name: string | undefined): string {
  const first = name?.trim().split(/\s+/)[0]
  if (!first) return 'there'
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

export default function DashboardPage() {
  const { data: tests, isLoading, isError, error, refetch } = useGetTestsQuery()
  const user = useAppSelector(selectCurrentUser)

  const metrics = useMemo(() => buildDashboardMetrics(tests ?? []), [tests])
  const coverage = useMemo(() => buildSubjectCoverage(tests ?? []), [tests])

  const statusSegments: BreakdownSegment[] = metrics.statusBreakdown.map((entry) => ({
    key: entry.status,
    label: entry.status,
    count: entry.count,
    share: entry.share,
    colorClassName: STATUS_COLORS[entry.status] ?? 'bg-ink-400',
  }))

  if (isError && !tests) {
    return (
      <>
        <PageHeader crumbs={[{ label: 'Dashboard' }]} title="Dashboard" />
        <Alert>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{getApiErrorMessage(error, 'Could not load your dashboard.')}</span>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Alert>
      </>
    )
  }

  // The greeting and CTA need no data, so only the content area waits.
  const isInitialLoad = isLoading && !tests

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Dashboard' }]}
        title={`Welcome back, ${firstName(user?.name)}`}
        actions={
          <Link to={PATH_DASHBOARD.tests.create}>
            <Button>Create New Test</Button>
          </Link>
        }
      />

      {isInitialLoad ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Tests"
              value={metrics.total}
              icon="tests"
              tone="brand"
              hint={metrics.drafts > 0 ? `${metrics.drafts} still in draft` : 'No drafts pending'}
              to={PATH_DASHBOARD.tests.root}
            />
            <StatCard
              label="Live"
              value={metrics.live}
              icon="live"
              tone="success"
              hint={
                metrics.expiringSoon > 0
                  ? `${metrics.expiringSoon} expiring this week`
                  : 'Visible to students'
              }
              to={PATH_DASHBOARD.tests.root}
            />
            <StatCard
              label="Questions Authored"
              value={metrics.totalQuestions}
              icon="questions"
              tone="ink"
              hint={`of ${metrics.targetQuestions} planned`}
            />
            <StatCard
              label="Question Bank Filled"
              value={Math.round(metrics.completion * 100)}
              suffix="%"
              icon="progress"
              tone="amber"
              hint={
                metrics.incomplete.length > 0
                  ? `${metrics.incomplete.length} test${metrics.incomplete.length === 1 ? '' : 's'} incomplete`
                  : 'Every test is complete'
              }
            />
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-3">
            <DashboardCard
              title="Subject coverage"
              description="Where the question bank is deep, and where it's thin"
              className="xl:col-span-2"
            >
              {coverage.length === 0 ? (
                <EmptyState
                  title="No coverage yet"
                  description="Create a test and tag it with a subject to see coverage here."
                />
              ) : (
                <CoveragePanel subjects={coverage.slice(0, 5)} />
              )}
            </DashboardCard>

            <div className="flex flex-col gap-5">
              <DashboardCard title="By status">
                <BreakdownBar segments={statusSegments} caption="Tests by status" />
              </DashboardCard>

              <DashboardCard title="By difficulty" description="Share of tests at each level">
                <DifficultyStats stats={metrics.difficultyStats} />
              </DashboardCard>
            </div>
          </div>

          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-ink-900">Recently created</h2>
              <Link
                to={PATH_DASHBOARD.tests.root}
                className="text-sm font-medium text-link hover:underline"
              >
                View all tests
              </Link>
            </div>
            <TestsTable
              tests={metrics.recent}
              emptyState={
                <EmptyState
                  title="No tests yet"
                  description="Create your first test to get started."
                  action={
                    <Link to={PATH_DASHBOARD.tests.create}>
                      <Button size="sm">Create New Test</Button>
                    </Link>
                  }
                />
              }
            />
          </section>
        </div>
      )}
    </>
  )
}
