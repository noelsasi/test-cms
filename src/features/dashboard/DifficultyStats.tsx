import { cn } from '@/lib/cn'
import type { DifficultyLevel, DifficultyStat } from './dashboardMetrics'

/** Mirrors DifficultyBadge, so the two screens read as one system. */
const LEVEL_STYLES: Record<DifficultyLevel, { badge: string; bar: string }> = {
  easy: { badge: 'bg-success/10 text-success', bar: 'bg-success' },
  medium: { badge: 'bg-accent-amber/10 text-accent-amber', bar: 'bg-accent-amber' },
  hard: { badge: 'bg-danger/10 text-danger', bar: 'bg-danger' },
}

/**
 * How the catalogue is spread across difficulty levels. Tests carry the level,
 * so the question figure is "questions sitting in tests set to this level" —
 * enough to spot a bank that's, say, all easy and has no hard set at all.
 */
export function DifficultyStats({ stats }: { stats: DifficultyStat[] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {stats.map((stat) => {
        const styles = LEVEL_STYLES[stat.level]

        return (
          <li key={stat.level}>
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                  styles.badge,
                )}
              >
                {stat.level}
              </span>
              <span className="text-xs text-ink-500">
                <span className="tabular-nums font-medium text-ink-900">{stat.tests}</span>{' '}
                {stat.tests === 1 ? 'test' : 'tests'} ·{' '}
                <span className="tabular-nums">{stat.questions}</span> Qs
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-400/15">
                <span
                  className={cn('block h-full rounded-full', styles.bar)}
                  style={{ width: `${stat.share * 100}%` }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-xs tabular-nums text-ink-400">
                {Math.round(stat.share * 100)}%
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
