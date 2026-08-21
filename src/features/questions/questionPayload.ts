import type { Question, QuestionPayload, SubTopic, Topic } from '@/types'
import type { QuestionFormValues } from './questionSchema'

/**
 * The API validates optional fields as "must be a string" and rejects an
 * explicit null, so blank values are dropped from the body entirely rather
 * than sent as null. They still read back as null afterwards.
 */
type WritableQuestion = Partial<QuestionPayload> & { subject?: string }

/** Named lists used to translate the form's ids into the names the API wants. */
export interface TaxonomyLookup {
  topics: Topic[]
  subTopics: SubTopic[]
}

function nameFor(id: string | null, items: { id: string; name: string }[]): string | undefined {
  if (!id) return undefined
  return items.find((item) => item.id === id)?.name
}

function withoutBlanks(values: QuestionFormValues, lookup: TaxonomyLookup): WritableQuestion {
  const body: WritableQuestion = {
    question: values.question,
    option1: values.option1,
    option2: values.option2,
    option3: values.option3,
    option4: values.option4,
    correct_option: values.correct_option,
  }

  if (values.explanation) body.explanation = values.explanation
  if (values.difficulty) body.difficulty = values.difficulty
  if (values.media_url) body.media_url = values.media_url

  /**
   * Questions take topic/sub-topic as display *names*, unlike tests, which
   * take uuids for the same taxonomy. Sending an id fails with
   * "Topic '<uuid>' not found", so ids are resolved back to names here.
   */
  const topicName = nameFor(values.topic, lookup.topics)
  if (topicName) body.topic = topicName

  const subTopicName = nameFor(values.sub_topic, lookup.subTopics)
  if (subTopicName) body.sub_topic = subTopicName

  return body
}

/** `subject` is required on create even though the task PDF omits it. */
export function toCreatePayload(
  values: QuestionFormValues,
  testId: string,
  subjectId: string,
  lookup: TaxonomyLookup,
): WritableQuestion {
  return {
    ...withoutBlanks(values, lookup),
    type: 'mcq',
    test_id: testId,
    subject: subjectId,
  }
}

export function toUpdatePayload(
  values: QuestionFormValues,
  lookup: TaxonomyLookup,
): WritableQuestion {
  return withoutBlanks(values, lookup)
}

/** Questions store topic/sub-topic as names; the selects are keyed by id. */
function idForName(name: string | null, items: { id: string; name: string }[]): string | null {
  if (!name) return null
  return items.find((item) => item.name === name)?.id ?? null
}

/**
 * The inverse of `withoutBlanks` — turns a saved question back into form
 * values, re-resolving the stored names into the ids the selects expect.
 */
export function questionToFormValues(
  question: Question,
  lookup: TaxonomyLookup,
): QuestionFormValues {
  return {
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correct_option: question.correct_option,
    explanation: question.explanation,
    difficulty: question.difficulty,
    media_url: question.media_url,
    topic: idForName(question.topic, lookup.topics),
    sub_topic: idForName(question.sub_topic, lookup.subTopics),
  }
}
