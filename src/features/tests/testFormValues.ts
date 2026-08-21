import type { SubTopic, Subject, Test, Topic } from '@/types'
import { DEFAULT_TEST_VALUES, type TestFormValues } from './testSchema'

/**
 * The API reads back `subject`/`topics`/`sub_topics` as display names but only
 * accepts UUIDs on write, so editing means resolving names to ids first.
 * Names are not guaranteed unique; the first match wins, which is the best the
 * API allows without an id-bearing read endpoint.
 *
 * A name with no match cannot be written back at all, so it is reported rather
 * than dropped — saving would otherwise silently strip it from the test.
 */
function idsForNames(
  names: string[] | null,
  source: { id: string; name: string }[],
): { ids: string[]; unresolved: string[] } {
  if (!names) return { ids: [], unresolved: [] }

  const ids: string[] = []
  const unresolved: string[] = []

  for (const name of names) {
    const match = source.find((item) => item.name === name)
    if (match) ids.push(match.id)
    else unresolved.push(name)
  }

  return { ids, unresolved }
}

export function testToFormValues(
  test: Test,
  subjects: Subject[],
  topics: Topic[],
  subTopics: SubTopic[],
): { values: TestFormValues; unresolved: string[] } {
  const subject = idsForNames([test.subject], subjects)
  const topicResult = idsForNames(test.topics, topics)
  const subTopicResult = idsForNames(test.sub_topics, subTopics)

  const values: TestFormValues = {
    ...DEFAULT_TEST_VALUES,
    name: test.name,
    type: test.type,
    subject: subject.ids[0] ?? '',
    topics: topicResult.ids,
    sub_topics: subTopicResult.ids,
    difficulty: test.difficulty,
    correct_marks: test.correct_marks,
    wrong_marks: test.wrong_marks,
    unattempt_marks: test.unattempt_marks,
    total_time: test.total_time,
    total_questions: test.total_questions,
    total_marks: test.total_marks,
  }

  return {
    values,
    unresolved: [...subject.unresolved, ...topicResult.unresolved, ...subTopicResult.unresolved],
  }
}

/** Subject name → id, needed before topics can be fetched for prefill. */
export function subjectIdForName(name: string, subjects: Subject[]): string | undefined {
  return subjects.find((subject) => subject.name === name)?.id
}
