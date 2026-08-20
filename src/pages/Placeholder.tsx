/**
 * Temporary stand-in while each page is built out step by step.
 * Every route resolves from day one, so navigation can be verified early.
 */
export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-10">
      <h1 className="text-lg font-semibold text-ink-900">{title}</h1>
      <p className="text-sm text-ink-500">This screen has not been implemented yet.</p>
    </div>
  )
}
