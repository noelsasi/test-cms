import { useMemo, useState } from 'react'

interface UsePaginationResult<T> {
  page: number
  pageCount: number
  pageItems: T[]
  setPage: (page: number) => void
  /** 1-based index of the first row on this page, for "showing X–Y of Z". */
  rangeStart: number
  rangeEnd: number
}

/**
 * Client-side pagination. The tests API returns every row and ignores
 * page/limit/offset, so slicing happens here rather than server-side.
 */
export function usePagination<T>(items: T[], pageSize = 10): UsePaginationResult<T> {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))

  // Filtering can shrink the list under the current page. Clamping during
  // render (rather than in an effect) avoids a blank page on the first paint.
  const safePage = Math.min(page, pageCount)

  const pageItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  )

  return {
    page: safePage,
    pageCount,
    pageItems,
    setPage,
    rangeStart: items.length === 0 ? 0 : (safePage - 1) * pageSize + 1,
    rangeEnd: Math.min(safePage * pageSize, items.length),
  }
}
