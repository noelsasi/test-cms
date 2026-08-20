import { formatDuration } from '@/lib/format'
import type { Test } from '@/types'

const TYPE_LABELS: Record<Test['type'], string> = {
  chapterwise: 'Chapter Wise',
  pyq: 'PYQ',
  mock: 'Mock Test',
}

/** Read-only recap of the test, shown above the question and preview steps. */
export function TestSummaryCard({ test }: { test: Test }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface p-5">
      <span className="inline-flex rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
        {TYPE_LABELS[test.type]}
      </span>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-ink-900">{test.name}</h2>
            <span className="inline-flex rounded-full bg-accent-teal px-3 py-1 text-xs font-medium capitalize text-white">
              {test.difficulty}
            </span>
          </div>

          <SummaryRow label="Subject" values={[test.subject]} plain />
          <SummaryRow label="Topic" values={test.topics ?? []} />
          <SummaryRow label="Sub Topic" values={test.sub_topics ?? []} />
        </div>

        <dl className="flex flex-wrap items-center divide-x divide-line rounded-[var(--radius-field)] border border-line text-sm">
          <Stat label={formatDuration(test.total_time)} />
          <Stat label={`${test.total_questions} Q's`} />
          <Stat label={`${test.total_marks} Marks`} />
        </dl>
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  values,
  plain = false,
}: {
  label: string
  values: string[]
  plain?: boolean
}) {
  if (values.length === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-20 shrink-0 text-ink-500">{label}</span>
      <span className="text-ink-500">:</span>
      {plain ? (
        <span className="text-ink-900">{values[0]}</span>
      ) : (
        <span className="flex flex-wrap gap-1.5">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-md border border-accent-amber/50 px-2 py-0.5 text-xs text-accent-amber"
            >
              {value}
            </span>
          ))}
        </span>
      )}
    </div>
  )
}

function Stat({ label }: { label: string }) {
  return <dd className="px-4 py-2 text-ink-700">{label}</dd>
}
