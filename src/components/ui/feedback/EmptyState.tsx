import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

/** Shared "nothing here" panel, so every screen phrases emptiness the same way. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-2 p-10 text-center">
      <p className="font-medium text-ink-900">{title}</p>
      {description && <p className="text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
