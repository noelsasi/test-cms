import { Skeleton, SkeletonRegion } from '@/components/ui'

/** Widths vary so the placeholder reads as content, not a grid of identical bars. */
const SUBJECT_BAR_WIDTHS = ['w-full', 'w-4/5', 'w-3/5', 'w-2/5', 'w-1/4']

function StatCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="size-9 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-20 rounded-md" />
      <Skeleton className="mt-2.5 h-3 w-28 rounded-full" />
    </div>
  )
}

function CardShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

function CardHeading({ withDescription = false }: { withDescription?: boolean }) {
  return (
    <div className="mb-5">
      <Skeleton className="h-4 w-32 rounded-full" />
      {withDescription && <Skeleton className="mt-2 h-3 w-52 rounded-full" />}
    </div>
  )
}

/**
 * Mirrors the real dashboard's structure — four stat cards, a two-thirds
 * coverage panel beside the status and difficulty cards, then the recent
 * table — so the page doesn't reflow when the data arrives.
 */
export function DashboardSkeleton() {
  return (
    <SkeletonRegion label="Loading dashboard…" className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-3">
        <CardShell className="xl:col-span-2">
          <CardHeading withDescription />
          <ul className="flex flex-col">
            {SUBJECT_BAR_WIDTHS.map((width) => (
              <li key={width} className="border-b border-line py-3.5 last:border-b-0">
                <div className="flex items-baseline justify-between gap-3">
                  <Skeleton className="h-4 w-36 rounded-full" />
                  <Skeleton className="h-3 w-40 rounded-full" />
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-400/10">
                  <Skeleton className={`h-full rounded-full ${width}`} />
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        </CardShell>

        <div className="flex flex-col gap-5">
          <CardShell>
            <CardHeading />
            <Skeleton className="h-2.5 w-full rounded-full" />
            <ul className="mt-4 flex flex-col gap-2.5">
              {Array.from({ length: 5 }, (_, index) => (
                <li key={index} className="flex items-center gap-2.5">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="h-3 flex-1 rounded-full" />
                  <Skeleton className="h-3 w-8 rounded-full" />
                </li>
              ))}
            </ul>
          </CardShell>

          <CardShell>
            <CardHeading withDescription />
            <ul className="flex flex-col gap-3.5">
              {Array.from({ length: 3 }, (_, index) => (
                <li key={index}>
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-3 w-24 rounded-full" />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-1.5 flex-1 rounded-full" />
                    <Skeleton className="h-3 w-9 rounded-full" />
                  </div>
                </li>
              ))}
            </ul>
          </CardShell>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <div className="rounded-[var(--radius-card)] border border-line bg-surface">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-line/70 px-5 py-3.5 last:border-0"
            >
              <div className="flex-1">
                <Skeleton className="h-4 w-56 rounded-full" />
                <Skeleton className="mt-1.5 h-3 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-8 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-3 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </SkeletonRegion>
  )
}
