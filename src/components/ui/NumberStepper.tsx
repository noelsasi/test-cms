import { useId } from 'react'
import { cn } from '@/lib/cn'

interface NumberStepperProps {
  label?: string
  error?: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  /** Renders positive values as "+5", matching the marking-scheme design. */
  showSign?: boolean
  disabled?: boolean
}

export function NumberStepper({
  label,
  error,
  value,
  onChange,
  step = 1,
  min,
  max,
  showSign = false,
  disabled = false,
}: NumberStepperProps) {
  const inputId = useId()
  const errorId = `${inputId}-error`

  function clamp(next: number): number {
    if (min !== undefined && next < min) return min
    if (max !== undefined && next > max) return max
    return next
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-900">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center justify-between gap-2 rounded-[var(--radius-field)] border bg-surface pl-3 pr-1.5 py-1',
          'focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-brand-600',
          disabled && 'bg-brand-50',
          error ? 'border-danger' : 'border-line',
        )}
      >
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          value={value}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            const next = Number(event.target.value)
            // An empty or half-typed field parses as NaN — keep the last value.
            if (!Number.isNaN(next)) onChange(clamp(next))
          }}
          className={cn(
            'w-full min-w-0 bg-transparent py-1 text-sm text-ink-900 outline-none',
            // Native spinners are replaced by the buttons beside the field.
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          )}
        />
        {showSign && value > 0 && (
          <span aria-hidden className="pointer-events-none order-first text-sm text-ink-900">
            +
          </span>
        )}
        <span className="flex flex-col">
          <StepButton
            label="Increase"
            disabled={disabled}
            onClick={() => onChange(clamp(value + step))}
          >
            <path d="M6 15l6-6 6 6" />
          </StepButton>
          <StepButton
            label="Decrease"
            disabled={disabled}
            onClick={() => onChange(clamp(value - step))}
          >
            <path d="M6 9l6 6 6-6" />
          </StepButton>
        </span>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="text-ink-400 transition-colors hover:text-ink-700 disabled:cursor-not-allowed"
    >
      <svg
        className="size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden
      >
        {children}
      </svg>
    </button>
  )
}
