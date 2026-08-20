import { cn } from '@/lib/cn'

interface QuestionNavigatorProps {
  /** One entry per slot; `true` once that slot has a saved question. */
  completed: boolean[]
  activeIndex: number
  totalQuestions: number
  onSelect: (index: number) => void
}

export function QuestionNavigator({
  completed,
  activeIndex,
  totalQuestions,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <aside
      /* Stacks above the form on small screens. From `lg` it docks alongside
         and sticks within the scrolling <main>, capped to the viewport so a
         long slot list scrolls inside the panel rather than past the top. */
      className="flex max-h-72 w-full flex-col rounded-[var(--radius-card)] border border-line bg-surface p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-8rem)] lg:w-56 lg:shrink-0"
    >
      <h2 className="text-sm font-medium text-ink-700">Question creation</h2>

      <p className="mt-3 text-xs text-ink-500">Total Questions . {totalQuestions}</p>

      <ol className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {completed.map((isDone, index) => {
          const isActive = index === activeIndex

          return (
            <li key={`slot-${index + 1}`}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? 'true' : undefined}
                title={`Question ${index + 1}`}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[var(--radius-field)] border px-2.5 py-2 text-xs transition-colors',
                  isDone ? 'border-success/50 text-success' : 'border-line/70 text-ink-400/70',
                  // Only the slot being edited is filled; saved slots stay white.
                  isActive && (isDone ? 'bg-success/10' : 'bg-canvas'),
                )}
              >
                <StatusDot isDone={isDone} />
                <span className="truncate">Question {index + 1}</span>
                <svg
                  className="ml-auto size-3.5 shrink-0 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                </svg>
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

function StatusDot({ isDone }: { isDone: boolean }) {
  if (!isDone) return <span className="size-3.5 shrink-0 rounded-full bg-ink-400/25" />

  return (
    <svg className="size-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  )
}
