import { lazy, Suspense, type ComponentProps } from 'react'
import { Spinner } from './Spinner'

const RichTextEditorImpl = lazy(() =>
  import('./RichTextEditorImpl').then((module) => ({ default: module.RichTextEditorImpl })),
)

type RichTextEditorProps = ComponentProps<typeof RichTextEditorImpl>

/**
 * The editor pulls in TipTap/ProseMirror, which is large and only needed on
 * the question screens — so it is split out of the shared UI bundle.
 */
export function RichTextEditor(props: RichTextEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-56 items-center justify-center gap-2 rounded-[var(--radius-field)] border border-line bg-surface">
          <Spinner className="size-5" />
          <span className="text-sm text-ink-500">Loading editor…</span>
        </div>
      }
    >
      <RichTextEditorImpl {...props} />
    </Suspense>
  )
}
