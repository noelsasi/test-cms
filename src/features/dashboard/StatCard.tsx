import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type StatTone = 'brand' | 'success' | 'amber' | 'ink'

/**
 * Tone drives only the icon chip — the number itself stays ink-900 in every
 * card so the row reads as one scale rather than five competing colours.
 */
const TONES: Record<StatTone, string> = {
  brand: 'bg-brand-50 text-brand-600',
  success: 'bg-success/10 text-success',
  amber: 'bg-accent-amber/10 text-accent-amber',
  ink: 'bg-ink-400/10 text-ink-500',
}

type StatIcon = 'tests' | 'live' | 'scheduled' | 'questions' | 'progress'

function Icon({ name }: { name: StatIcon }) {
  const common = {
    className: 'size-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (name === 'tests') {
    return (
      <svg {...common}>
        <path d="M6 4h9l4 4v12a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
        <path d="M14 4v5h5" />
      </svg>
    )
  }

  if (name === 'live') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M6.5 6.5a7.8 7.8 0 000 11M17.5 6.5a7.8 7.8 0 010 11" />
      </svg>
    )
  }

  if (name === 'scheduled') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </svg>
    )
  }

  if (name === 'questions') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.5a2.6 2.6 0 015 .8c0 1.7-2.5 2.2-2.5 3.7" />
        <path d="M12 17.5h.01" />
      </svg>
    )
  }

  // progress — a part-filled ring, reading as "share complete".
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" opacity={0.35} />
      <path d="M12 3a9 9 0 019 9" />
      <path d="M12 8v4l2.5 1.5" />
    </svg>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: StatIcon
  tone?: StatTone
  /** Rendered tight against the number, e.g. "%". */
  suffix?: string
  /** Short qualifier under the number, e.g. "3 awaiting questions". */
  hint?: string
  /** Makes the whole card a shortcut into the filtered list. */
  to?: string
}

export function StatCard({ label, value, icon, tone = 'brand', suffix, hint, to }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-ink-500">{label}</span>
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-full', TONES[tone])}>
          <Icon name={icon} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums text-ink-900">
        {value}
        {suffix && <span className="ml-0.5 text-xl text-ink-400">{suffix}</span>}
      </p>
      <p className="mt-1 min-h-5 text-xs text-ink-400">{hint}</p>
    </>
  )

  const className = cn(
    'rounded-[var(--radius-card)] border border-line bg-surface p-5',
    to && 'transition-colors hover:border-brand-200 hover:bg-brand-50/30',
  )

  if (to) {
    return (
      <Link to={to} className={cn(className, 'block')}>
        {body}
      </Link>
    )
  }

  return <div className={className}>{body}</div>
}
