/** Shared display formatters, so date/number rendering stays consistent. */

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Marking-scheme values read better with an explicit sign: +5, -1, +0. */
export function formatSignedMarks(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} Min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} Hr` : `${hours} Hr ${rest} Min`
}
