import { cn } from '@/lib/cn'

export interface BreakdownSegment {
  key: string
  label: string
  count: number
  share: number
  /** Tailwind background class for the segment and its legend swatch. */
  colorClassName: string
}

interface BreakdownBarProps {
  segments: BreakdownSegment[]
  /** Noun for the accessible summary, e.g. "tests by status". */
  caption: string
}

/**
 * A stacked proportion bar with a legend — enough to read the shape of the
 * catalogue at a glance without pulling in a charting dependency.
 */
export function BreakdownBar({ segments, caption }: BreakdownBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0)

  if (total === 0) {
    return <p className="text-sm text-ink-400">No data yet.</p>
  }

  return (
    <div>
      <div
        className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-ink-400/15"
        role="img"
        aria-label={`${caption}: ${segments
          .map((segment) => `${segment.label} ${segment.count}`)
          .join(', ')}`}
      >
        {segments.map((segment) => (
          <span
            key={segment.key}
            className={cn(
              'h-full first:rounded-l-full last:rounded-r-full',
              segment.colorClassName,
            )}
            /* Percentage widths are the one value that can't come from a class. */
            style={{ width: `${segment.share * 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2.5 text-sm">
            <span
              className={cn('size-2 shrink-0 rounded-full', segment.colorClassName)}
              aria-hidden
            />
            <span className="flex-1 truncate capitalize text-ink-700">{segment.label}</span>
            <span className="tabular-nums font-medium text-ink-900">{segment.count}</span>
            <span className="w-10 text-right tabular-nums text-xs text-ink-400">
              {Math.round(segment.share * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
