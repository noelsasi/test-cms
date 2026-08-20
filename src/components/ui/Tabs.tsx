import { cn } from '@/lib/cn'

export interface TabItem<T extends string> {
  value: T
  label: string
}

interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Segmented control — the Chapterwise / PYQ / Mock Test switcher. */
export function Tabs<T extends string>({ items, value, onChange, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex w-fit self-start items-center gap-1 rounded-[var(--radius-card)] border border-line bg-canvas p-1',
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-[var(--radius-field)] px-5 py-2 text-sm font-medium transition-colors',
            value === item.value
              ? 'bg-surface text-brand-600 shadow-sm'
              : 'text-ink-400 hover:text-ink-700',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
