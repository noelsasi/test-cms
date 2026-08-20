import { useId, type Ref, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  /** Shown as a disabled first entry while the value is empty. */
  placeholder?: string
  ref?: Ref<HTMLSelectElement>
}

export function Select({
  label,
  error,
  options,
  placeholder = 'Choose from Drop-down',
  id,
  className,
  ref,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink-900">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full appearance-none rounded-[var(--radius-field)] border bg-surface py-2 pl-3 pr-9 text-sm',
            'focus:outline-2 focus:outline-offset-0 focus:outline-brand-600',
            'disabled:cursor-not-allowed disabled:bg-brand-50',
            // An empty value is the placeholder, which reads as muted.
            props.value === '' ? 'text-ink-400' : 'text-ink-900',
            error ? 'border-danger' : 'border-line',
            className,
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-ink-900">
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
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
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
