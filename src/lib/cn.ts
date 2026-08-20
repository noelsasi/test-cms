/**
 * Minimal className joiner. Kept dependency-free — we only ever need
 * conditional joining, not the full tailwind-merge conflict resolution.
 */
export type ClassValue = string | number | false | null | undefined

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
