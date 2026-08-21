import { useId } from 'react'
import { cn } from '@/lib/cn'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  label?: string
  error?: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name?: string
  className?: string
}

export function RadioGroup({
  label,
  error,
  options,
  value,
  onChange,
  name,
  className,
}: RadioGroupProps) {
  const generatedName = useId()
  const groupName = name ?? generatedName
  const errorId = `${groupName}-error`

  return (
    <fieldset className="flex flex-col gap-1.5">
      {label && <legend className="mb-1.5 text-sm font-medium text-ink-900">{label}</legend>}
      <div
        className={cn('flex flex-wrap items-center gap-8', className)}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-ink-700"
          >
            <input
              type="radio"
              name={groupName}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="size-4 accent-brand-600"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}
