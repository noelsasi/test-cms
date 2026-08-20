import { useId, type Ref, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  /** Clears the field — the trash affordance shown in the Figma. */
  onClear?: () => void
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ label, error, onClear, id, className, ref, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const errorId = `${textareaId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-ink-900">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          id={textareaId}
          ref={ref}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'w-full resize-y rounded-[var(--radius-field)] border bg-surface px-3 py-2 pr-10 text-sm text-ink-900',
            'placeholder:text-ink-400',
            'focus:outline-2 focus:outline-offset-0 focus:outline-brand-600',
            error ? 'border-danger' : 'border-line',
            className,
          )}
          {...props}
        />
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label={label ? `Clear ${label}` : 'Clear'}
            className="absolute right-2 top-2 text-ink-400 transition-colors hover:text-danger"
          >
            <TrashIcon />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function TrashIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}
