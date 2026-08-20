import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { selectCurrentUser, sessionExpired } from '@/features/auth'

/**
 * Names come back in inconsistent casing (e.g. "VEDANT BOSS"), and CSS
 * `capitalize` can't lowercase the tail — so normalise per word here.
 */
function toTitleCase(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/** Initials stand in for the avatar image the Figma shows. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || '?'
}

interface TopbarProps {
  /** Opens the off-canvas nav; the trigger only shows below `lg`. */
  onOpenNav: () => void
}

export function Topbar({ onOpenNav }: TopbarProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Click-outside close: a dropdown that only closes on re-click feels stuck.
  useEffect(() => {
    if (!isMenuOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isMenuOpen])

  return (
    <header className="flex h-20 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 sm:gap-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:bg-brand-50 lg:hidden"
      >
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <button
        type="button"
        aria-label="Notifications"
        className="relative grid size-11 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:bg-brand-50"
      >
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.7 21a2 2 0 01-3.4 0" />
        </svg>
        <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-success ring-2 ring-surface" />
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className="flex items-center gap-3 rounded-[var(--radius-field)] px-2 py-1.5 transition-colors hover:bg-brand-50"
        >
          <span className="grid size-11 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initialsOf(user?.name ?? '')}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-base font-semibold text-ink-900">
              {user?.name ? toTitleCase(user.name) : 'Account'}
            </span>
            <span className="block text-xs capitalize text-ink-500">{user?.role ?? ''}</span>
          </span>
          <svg
            className="size-4 text-ink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-[var(--radius-field)] border border-line bg-surface py-1 shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => dispatch(sessionExpired())}
              className="w-full px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/5"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
