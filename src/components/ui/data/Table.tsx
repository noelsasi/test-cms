import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { usePagination } from '@/lib/usePagination'
import { Pagination } from './Pagination'
import { Spinner } from '../primitives/Spinner'

export interface Column<T> {
  /** Stable identity for the column — also the React key. */
  key: string
  header: ReactNode
  /** Cell contents. Given the row so the caller decides how to render it. */
  render: (row: T) => ReactNode
  /** Extra classes for this column's `<td>`, e.g. width or alignment. */
  cellClassName?: string
  headerClassName?: string
}

export interface TablePaginationConfig {
  pageSize?: number
  /**
   * Controlled mode: supply `current` (with `onChange`) to drive paging from
   * the parent — needed once a screen pages server-side. Omit both and the
   * table keeps the page internally.
   */
  current?: number
  onChange?: (page: number) => void
  /**
   * Total row count for controlled/server-side paging, where `rows` holds only
   * the current page. Defaults to `rows.length` (client-side slicing).
   */
  total?: number
  /** Set false to keep the pager but drop the "Showing 1–10 of 42" line. */
  showTotal?: boolean
}

interface TableProps<T> {
  columns: Column<T>[]
  rows: T[]
  /** Row identity — required so keys survive sorting and filtering. */
  getRowId: (row: T) => string
  isLoading?: boolean
  /** Rendered in place of the rows when loading or empty. */
  emptyState?: ReactNode
  loadingLabel?: string
  onRowClick?: (row: T) => void
  className?: string
  /** Keeps columns readable on narrow viewports before the container scrolls. */
  minWidthClassName?: string
  /** `false` (default) renders every row. An object turns paging on. */
  pagination?: TablePaginationConfig | false
  /** Noun used in the summary line, e.g. "tests" → "Showing 1–10 of 42 tests". */
  itemNoun?: string
  /** Extra content for the footer bar, shown beside the summary. */
  footerNote?: ReactNode
  /**
   * Narrow-screen alternative to the table grid. When given, the `<table>` is
   * hidden below `md` and this renders the same page of rows instead — so
   * pagination, loading and empty states stay owned by one component.
   */
  renderCards?: (rows: T[]) => ReactNode
}

export function Table<T>({ pagination = false, ...props }: TableProps<T>) {
  // Hooks can't run conditionally, so the paginated variant is its own
  // component that only mounts when paging is switched on.
  if (!pagination) return <TableView {...props} />

  return <PaginatedTable {...props} pagination={pagination} />
}

function PaginatedTable<T>({
  pagination,
  rows,
  itemNoun = 'items',
  footerNote,
  isLoading,
  ...props
}: Omit<TableProps<T>, 'pagination'> & { pagination: TablePaginationConfig }) {
  const { pageSize = 10, current, onChange, total, showTotal = true } = pagination
  const isControlled = current !== undefined

  const internal = usePagination(rows, pageSize)
  const page = isControlled ? current : internal.page
  // In controlled mode the parent already handed us just this page's rows.
  const visibleRows = isControlled ? rows : internal.pageItems

  const rowTotal = total ?? rows.length
  const pageCount = Math.max(1, Math.ceil(rowTotal / pageSize))
  const rangeStart = rowTotal === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeEnd = Math.min(page * pageSize, rowTotal)

  function handlePageChange(next: number) {
    if (!isControlled) internal.setPage(next)
    onChange?.(next)
  }

  const hasFooter = rowTotal > 0 && !isLoading && (showTotal || pageCount > 1 || footerNote)

  return (
    <>
      <TableView {...props} rows={visibleRows} isLoading={isLoading} />

      {hasFooter && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-500">
            {showTotal && (
              <>
                Showing {rangeStart}–{rangeEnd} of {rowTotal} {itemNoun}
              </>
            )}
            {footerNote}
          </p>
          <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
      )}
    </>
  )
}

/**
 * Column-configured data table. Callers describe columns and hand over rows;
 * the shell, header, hover and empty/loading states stay consistent everywhere.
 */
function TableView<T>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  emptyState,
  loadingLabel = 'Loading…',
  onRowClick,
  className,
  minWidthClassName = 'min-w-3xl',
  renderCards,
}: Omit<TableProps<T>, 'pagination' | 'itemNoun' | 'footerNote'>) {
  const shell = cn(
    'overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface',
    className,
  )

  if (isLoading) {
    return (
      <div className={cn(shell, 'flex min-h-64 items-center justify-center gap-3')}>
        <Spinner className="size-6" />
        <span className="text-sm text-ink-500">{loadingLabel}</span>
      </div>
    )
  }

  if (rows.length === 0 && emptyState) {
    return <div className={cn(shell, 'border-dashed')}>{emptyState}</div>
  }

  if (renderCards) {
    return (
      <>
        <div className="md:hidden">{renderCards(rows)}</div>
        <div className={cn(shell, 'hidden md:block')}>
          <TableGrid
            columns={columns}
            rows={rows}
            getRowId={getRowId}
            onRowClick={onRowClick}
            minWidthClassName={minWidthClassName}
          />
        </div>
      </>
    )
  }

  return (
    <div className={shell}>
      <TableGrid
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        onRowClick={onRowClick}
        minWidthClassName={minWidthClassName}
      />
    </div>
  )
}

function TableGrid<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  minWidthClassName,
}: Pick<TableProps<T>, 'columns' | 'rows' | 'getRowId' | 'onRowClick'> & {
  minWidthClassName: string
}) {
  return (
    <table className={cn('w-full border-collapse text-sm', minWidthClassName)}>
      <thead className="bg-canvas/70">
        <tr className="border-b border-line text-left">
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={cn(
                'relative px-5 py-3 text-xs font-semibold tracking-wider text-ink-500 uppercase',
                column.headerClassName,
              )}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={getRowId(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              'border-b border-line/70 transition-colors last:border-0 hover:bg-canvas/80',
              onRowClick && 'cursor-pointer',
            )}
          >
            {columns.map((column) => (
              <td
                key={column.key}
                className={cn('px-5 py-3.5 align-middle text-ink-700', column.cellClassName)}
              >
                {column.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
