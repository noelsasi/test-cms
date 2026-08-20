import { useEffect } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Blocking confirmation for destructive actions. Rendered inline rather than
 * portalled — the overlay is fixed, so it covers the viewport either way.
 */
export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-xl"
      >
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        {description && <p className="mt-2 text-sm text-ink-500">{description}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
