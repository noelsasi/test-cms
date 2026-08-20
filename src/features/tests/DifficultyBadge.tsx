import { cn } from '@/lib/cn'
import type { Difficulty } from '@/types'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'bg-success/10 text-success',
  medium: 'bg-accent-amber/10 text-accent-amber',
  difficult: 'bg-danger/10 text-danger',
  hard: 'bg-danger/10 text-danger',
}

/** The API says `hard`, the forms say `difficult` — show one label for both. */
const DIFFICULTY_LABELS: Partial<Record<Difficulty, string>> = {
  difficult: 'Hard',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        DIFFICULTY_STYLES[difficulty],
      )}
    >
      {DIFFICULTY_LABELS[difficulty] ?? difficulty}
    </span>
  )
}
