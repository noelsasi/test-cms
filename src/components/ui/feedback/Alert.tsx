import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface AlertProps {
  variant?: 'error' | 'success'
  children: ReactNode
  className?: string
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[var(--radius-field)] border px-4 py-3 text-sm',
        variant === 'error'
          ? 'border-danger/30 bg-danger/10 text-danger'
          : 'border-success/30 bg-success/10 text-success',
        className,
      )}
    >
      {children}
    </div>
  )
}
