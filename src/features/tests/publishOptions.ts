/** "Live Until" choices from the confirmation screen. */
export type LiveUntil = 'always' | '1w' | '2w' | '3w' | '1m' | 'custom'

export const LIVE_UNTIL_OPTIONS: { value: LiveUntil; label: string }[] = [
  { value: 'always', label: 'Always Available' },
  { value: '3w', label: '3 Weeks' },
  { value: '1w', label: '1 Week' },
  { value: '1m', label: '1 Month' },
  { value: '2w', label: '2 Weeks' },
  { value: 'custom', label: 'Custom Duration' },
]

const DAYS_BY_OPTION: Partial<Record<LiveUntil, number>> = {
  '1w': 7,
  '2w': 14,
  '3w': 21,
  '1m': 30,
}

/**
 * Resolves the chosen duration to an expiry timestamp. `always` returns
 * undefined so the field can be omitted — the API rejects an explicit null.
 *
 * Note this cannot *clear* an expiry already stored against the test: the API
 * refuses both null and "", so re-publishing as "Always Available" leaves any
 * previous date in place.
 */
export function expiryDateFor(
  option: LiveUntil,
  customEndsAt: string,
  from: Date = new Date(),
): string | undefined {
  if (option === 'always') return undefined

  if (option === 'custom') {
    if (!customEndsAt) return undefined
    const parsed = new Date(customEndsAt)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
  }

  const days = DAYS_BY_OPTION[option]
  if (!days) return undefined

  const expiry = new Date(from)
  expiry.setDate(expiry.getDate() + days)
  return expiry.toISOString()
}
