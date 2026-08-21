import { Button } from '../primitives/Button'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}

/**
 * Compact page list: first and last are always reachable, with a window around
 * the current page so the control stays a fixed width on large data sets.
 */
function pageItems(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1)

  const items: (number | 'gap')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) items.push('gap')
  for (let i = start; i <= end; i += 1) items.push(i)
  if (end < pageCount - 1) items.push('gap')
  items.push(pageCount)

  return items
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>

      {pageItems(page, pageCount).map((item, index) =>
        item === 'gap' ? (
          <span key={index < pageCount / 2 ? 'gap-start' : 'gap-end'} className="px-2 text-ink-400">
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? 'primary' : 'secondary'}
            size="sm"
            className="min-w-8 px-2"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
      >
        Next
      </Button>
    </nav>
  )
}
