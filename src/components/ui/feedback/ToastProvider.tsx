import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ToastContext, type ToastVariant } from './toastContext'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

const TOAST_DURATION_MS = 4000

/** Inline, matching the icon convention elsewhere in the UI kit. */
function ToastIcon({ variant }: { variant: ToastVariant }) {
  return (
    <svg
      className="mt-px size-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      {variant === 'error' ? (
        <path d="M12 7v6M12 16.5v.01" />
      ) : (
        <path d="M8.5 12.5l2.5 2.5 4.5-5" />
      )}
    </svg>
  )
}

/**
 * Holds toasts above the router, so a message survives the navigation that
 * often triggers it (saving a draft returns to the list, for example).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  // Monotonic rather than derived from length — ids must stay unique even as
  // toasts are dismissed out of order.
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, message, variant }])
      setTimeout(() => dismiss(id), TOAST_DURATION_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        /* Polite so a toast never interrupts what a screen reader is reading;
           the same action is always visible on screen too. */
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-10 z-50 flex flex-col items-center gap-2 p-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              /* Fixed width rather than shrink-to-fit, so a short message gets
                 the same presence as a long one instead of a cramped pill.
                 Solid fill rather than Alert's tint: a toast competes with the
                 whole page for attention, where an Alert sits inside one. */
              'pointer-events-auto flex w-full max-w-md animate-toast-in items-start gap-3 rounded-[var(--radius-field)] px-4 py-3.5 text-sm font-medium text-white shadow-xl ring-1 ring-black/5 sm:w-md',
              toast.variant === 'error' ? 'bg-danger' : 'bg-success-solid',
            )}
          >
            <ToastIcon variant={toast.variant} />
            <span className="min-w-0 flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="-mr-1 shrink-0 cursor-pointer px-1 text-base leading-none text-white/70 transition-colors hover:text-white"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
