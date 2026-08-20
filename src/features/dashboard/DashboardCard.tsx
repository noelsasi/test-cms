import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DashboardCardProps {
  title: string
  /** Right-aligned slot, typically a "View all" link. */
  action?: ReactNode
  description?: string
  children: ReactNode
  className?: string
  /** Panels that own their own edge-to-edge content, e.g. a table. */
  bodyClassName?: string
}

/** Shared panel chrome, so every dashboard section frames itself the same way. */
export function DashboardCard({
  title,
  action,
  description,
  children,
  className,
  bodyClassName,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-[var(--radius-card)] border border-line bg-surface',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-ink-400">{description}</p>}
        </div>
        {action}
      </div>
      <div className={cn('flex-1 px-5 pb-5', bodyClassName)}>{children}</div>
    </section>
  )
}
