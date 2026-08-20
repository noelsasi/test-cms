import { cn } from '@/lib/cn'
import type { SubjectCoverage } from './coverage'

/** Topics shown inline before collapsing into a "+N more" count. */
const TOPIC_LIMIT = 4

function TopicChips({ subject }: { subject: SubjectCoverage }) {
  if (subject.topics.length === 0) {
    return <span className="text-xs text-ink-400">No topics tagged</span>
  }

  const shown = subject.topics.slice(0, TOPIC_LIMIT)
  const rest = subject.topics.length - shown.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((topic) => (
        <span
          key={topic.name}
          title={`${topic.questions} question${topic.questions === 1 ? '' : 's'} across ${topic.tests} test${topic.tests === 1 ? '' : 's'}`}
          className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2 py-0.5 text-[11px] text-ink-700"
        >
          {topic.name}
          <span className="tabular-nums text-ink-400">{topic.questions}</span>
        </span>
      ))}
      {rest > 0 && <span className="text-[11px] text-ink-400">+{rest} more</span>}
    </div>
  )
}

export function CoveragePanel({ subjects }: { subjects: SubjectCoverage[] }) {
  return (
    <ul className="flex flex-col">
      {subjects.map((subject) => (
        <li key={subject.subject} className="border-b border-line py-3.5 last:border-b-0">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate font-medium text-ink-900" title={subject.subject}>
              {subject.subject}
            </span>
            <span className="shrink-0 text-xs text-ink-500">
              <span className="tabular-nums font-medium text-ink-900">{subject.questions}</span>{' '}
              questions · <span className="tabular-nums">{subject.tests}</span>{' '}
              {subject.tests === 1 ? 'test' : 'tests'}
              {subject.live > 0 && (
                <>
                  {' · '}
                  <span className="tabular-nums text-success">{subject.live} live</span>
                </>
              )}
            </span>
          </div>

          {/* Relative to the biggest subject, so the bar answers "which part of
              the syllabus is thin?" rather than restating the raw count. */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-400/15">
            <span
              className={cn(
                'block h-full rounded-full',
                subject.questions === 0 ? 'bg-danger' : 'bg-brand-500',
              )}
              style={{ width: `${Math.max(subject.share * 100, 2)}%` }}
            />
          </div>

          <div className="mt-2.5">
            <TopicChips subject={subject} />
          </div>
        </li>
      ))}
    </ul>
  )
}
