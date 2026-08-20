import type { SubTopic, Subject, Test, Topic } from '@/types'
import { DEFAULT_TEST_VALUES, type TestFormValues } from './testSchema'

/**
 * The API reads back `subject`/`topics`/`sub_topics` as display names but only
 * accepts UUIDs on write, so editing means resolving names to ids first.
 * Names are not guaranteed unique; the first match wins, which is the best the
 * API allows without an id-bearing read endpoint.
 */
function idsForNames(names: string[] | null, source: { id: string; name: string }[]): string[] {
  if (!names) return []

  return names.flatMap((name) => {
    const match = source.find((item) => item.name === name)
    return match ? [match.id] : []
  })
}

export function testToFormValues(
  test: Test,
  subjects: Subject[],
  topics: Topic[],
  subTopics: SubTopic[],
): TestFormValues {
  const [subjectId = ''] = idsForNames([test.subject], subjects)

  return {
    ...DEFAULT_TEST_VALUES,
    name: test.name,
    type: test.type,
    subject: subjectId,
    topics: idsForNames(test.topics, topics),
    sub_topics: idsForNames(test.sub_topics, subTopics),
    difficulty: test.difficulty,
    correct_marks: test.correct_marks,
    wrong_marks: test.wrong_marks,
    unattempt_marks: test.unattempt_marks,
    total_time: test.total_time,
    total_questions: test.total_questions,
    total_marks: test.total_marks,
  }
}

/** Subject name → id, needed before topics can be fetched for prefill. */
export function subjectIdForName(name: string, subjects: Subject[]): string | undefined {
  return subjects.find((subject) => subject.name === name)?.id
}
