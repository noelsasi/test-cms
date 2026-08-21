import { useId, type InputHTMLAttributes, type Ref } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  /** React 19 passes refs as a plain prop, so no forwardRef wrapper is needed. */
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, id, className, ref, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-900">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'w-full rounded-[var(--radius-field)] border bg-surface px-3 py-2 text-sm text-ink-900',
          'placeholder:text-ink-400',
          'focus:outline-2 focus:outline-offset-0 focus:outline-brand-600',
          'disabled:cursor-not-allowed disabled:bg-brand-50',
          error ? 'border-danger' : 'border-line',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
