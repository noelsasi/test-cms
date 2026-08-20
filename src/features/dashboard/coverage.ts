import type { Test } from '@/types'
import { effectiveStatus, questionCount } from './dashboardMetrics'

export interface TopicCoverage {
  name: string
  tests: number
  questions: number
}

export interface SubjectCoverage {
  subject: string
  tests: number
  /** Tests currently visible to students — the part of the catalogue that counts. */
  live: number
  questions: number
  /** Distinct topics touched by this subject's tests. */
  topics: TopicCoverage[]
  /** 0–1 of the largest subject's question count, for the comparison bar. */
  share: number
}

/**
 * Where the catalogue is thick and where it is thin, by subject and topic.
 *
 * This is the question an author actually has when opening the CMS — a status
 * split tells them how many drafts exist, but not which part of the syllabus is
 * missing. Derived from the tests list alone: `subject` reads back as a display
 * name and `topics` as names, so no taxonomy lookup is needed.
 */
export function buildSubjectCoverage(tests: Test[]): SubjectCoverage[] {
  const bySubject = new Map<string, SubjectCoverage & { topicMap: Map<string, TopicCoverage> }>()

  for (const test of tests) {
    const subject = test.subject?.trim() || 'Unassigned'

    let entry = bySubject.get(subject)
    if (!entry) {
      entry = {
        subject,
        tests: 0,
        live: 0,
        questions: 0,
        topics: [],
        share: 0,
        topicMap: new Map(),
      }
      bySubject.set(subject, entry)
    }

    const authored = questionCount(test)
    entry.tests += 1
    entry.questions += authored
    if (effectiveStatus(test) === 'live') entry.live += 1

    for (const topic of test.topics ?? []) {
      const name = topic?.trim()
      if (!name) continue

      const existing = entry.topicMap.get(name)
      if (existing) {
        existing.tests += 1
        existing.questions += authored
      } else {
        entry.topicMap.set(name, { name, tests: 1, questions: authored })
      }
    }
  }

  const rows = [...bySubject.values()].map(({ topicMap, ...subject }) => ({
    ...subject,
    // Topics whose tests have no questions yet carry no coverage signal, so
    // they'd only add noise to a panel about where the bank is deep or thin.
    topics: [...topicMap.values()]
      .filter((topic) => topic.questions > 0)
      .sort((a, b) => b.questions - a.questions),
  }))

  // Ranked by authored questions so the thinnest subjects fall to the bottom,
  // which is exactly where an author needs to look next.
  rows.sort((a, b) => b.questions - a.questions || a.subject.localeCompare(b.subject))

  const largest = rows[0]?.questions ?? 0
  return rows.map((row) => ({
    ...row,
    share: largest === 0 ? 0 : row.questions / largest,
  }))
}
