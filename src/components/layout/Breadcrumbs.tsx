import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export interface Crumb {
  label: string
  /** Omit on the final crumb — the current page is not a link. */
  to?: string
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="text-ink-500 transition-colors hover:text-link">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(isLast ? 'text-ink-900' : 'text-ink-500')}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-ink-400">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
