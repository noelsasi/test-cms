import { cn } from '@/lib/cn'

interface SkeletonProps {
  /** Sizing and shape, e.g. "h-4 w-32 rounded-full". */
  className?: string
}

/**
 * A single shimmering placeholder block. Callers size it, so the same
 * primitive covers text lines, bars, chips and avatars.
 *
 * Skeletons are decorative: the surrounding region carries the loading status
 * for assistive tech, so each block is hidden from the accessibility tree.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <span aria-hidden className={cn('block animate-pulse bg-ink-400/15', className)} />
}

/**
 * Wraps a skeleton layout with the one announcement a screen reader needs,
 * instead of letting dozens of placeholder blocks speak individually.
 */
export function SkeletonRegion({
  label = 'Loading…',
  className,
  children,
}: {
  label?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
