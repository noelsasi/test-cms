import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '@/lib/cn'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  label?: string
  error?: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  /** Shown inside the closed control when there are no options to pick yet. */
  emptyHint?: string
}

export function MultiSelect({
  label,
  error,
  options,
  value,
  onChange,
  placeholder = 'Choose from Drop-down',
  disabled = false,
  emptyHint,
}: MultiSelectProps) {
  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Matches the Topbar menu: close on outside click, and on Escape so the
  // control can be dismissed without reaching for the mouse.
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const selected = options.filter((option) => value.includes(option.value))
  const isEmpty = options.length === 0

  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter((item) => item !== optionValue)
        : [...value, optionValue],
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-ink-900">
          {label}
        </label>
      )}

      <div ref={containerRef} className="relative">
        <button
          id={fieldId}
          type="button"
          disabled={disabled || isEmpty}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setIsOpen((open) => !open)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-[var(--radius-field)] border bg-surface py-2 pl-3 pr-3 text-left text-sm',
            'focus:outline-2 focus:outline-offset-0 focus:outline-brand-600',
            'disabled:cursor-not-allowed disabled:bg-brand-50',
            error ? 'border-danger' : 'border-line',
          )}
        >
          <span className={cn('truncate', selected.length === 0 && 'text-ink-400')}>
            {selected.length === 0
              ? (isEmpty && emptyHint) || placeholder
              : `${selected.length} selected`}
          </span>
          <svg
            className="size-4 shrink-0 text-ink-400"
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

        {isOpen && (
          <ul
            role="listbox"
            aria-multiselectable
            className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-[var(--radius-field)] border border-line bg-surface py-1 shadow-lg"
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)

              return (
                <li key={option.value}>
                  <label
                    role="option"
                    aria-selected={isSelected}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-ink-700 hover:bg-brand-50"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(option.value)}
                      className="size-4 accent-brand-600"
                    />
                    {option.label}
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Chips let the user drop a selection without reopening the menu. */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((option) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 rounded-full border border-accent-amber/40 bg-accent-amber/10 px-2 py-0.5 text-xs text-accent-amber"
            >
              {option.label}
              <button
                type="button"
                onClick={() => toggle(option.value)}
                aria-label={`Remove ${option.label}`}
                className="text-accent-amber/70 transition-colors hover:text-accent-amber"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
