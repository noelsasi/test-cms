import { cn } from '@/lib/cn'
import type { TestStatus } from '@/types'

/** `null` comes back for tests never explicitly saved — show them as drafts. */
const STATUS_STYLES: Record<NonNullable<TestStatus>, string> = {
  draft: 'bg-ink-400/10 text-ink-500',
  live: 'bg-success/10 text-success',
  scheduled: 'bg-accent-amber/10 text-accent-amber',
  expired: 'bg-danger/10 text-danger',
  unpublished: 'bg-brand-100 text-brand-700',
}

/**
 * Inline so the badge carries no icon-library dependency. Exported so the
 * status filters on the list screen show the same glyphs as the rows.
 */
export function StatusIcon({
  status,
  className,
}: {
  status: NonNullable<TestStatus>
  className?: string
}) {
  const common = {
    className: cn('size-3.5 shrink-0', className),
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (status === 'draft') {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
      </svg>
    )
  }

  if (status === 'live') {
    // A solid dot rather than a glyph — reads as "on air" at badge size.
    return (
      <span
        aria-hidden
        className={cn('flex size-3.5 shrink-0 items-center justify-center', className)}
      >
        <span className="size-2 rounded-full bg-current" />
      </span>
    )
  }

  if (status === 'scheduled') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  }

  if (status === 'expired') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    )
  }

  // unpublished
  return (
    <svg {...common}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A9.6 9.6 0 0112 5c5 0 9 4.5 9 7a11 11 0 01-2.3 3.4M6.5 6.6C4.3 8 3 10.1 3 12c0 2.5 4 7 9 7a9.7 9.7 0 004.2-.9" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  )
}

export function StatusBadge({ status }: { status: TestStatus }) {
  const value = status ?? 'draft'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        STATUS_STYLES[value],
      )}
    >
      <StatusIcon status={value} />
      {value}
    </span>
  )
}
