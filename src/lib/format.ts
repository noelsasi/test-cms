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

/**
 * Relative time for list screens — "2 days ago", "in 3 days". Uses
 * Intl.RelativeTimeFormat so the wording stays locale-correct, and picks the
 * largest unit that fits so we never render "in 47 hours".
 */
const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
]

export function formatRelativeDate(iso: string | null, now: Date = new Date()): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'

  const diff = date.getTime() - now.getTime()
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) {
      return formatter.format(Math.round(diff / ms), unit)
    }
  }

  return 'just now'
}
