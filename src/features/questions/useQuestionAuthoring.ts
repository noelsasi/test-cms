import { useMemo, useState } from 'react'
import {
  useGetSubTopicsByTopicsQuery,
  useGetTopicsBySubjectQuery,
  useSubjectId,
} from '@/features/taxonomy'
import { useGetTestQuery, useUpdateTestMutation } from '@/features/tests'
import type { Question } from '@/types'
import { questionToFormValues, toCreatePayload, toUpdatePayload } from './questionPayload'
import type { QuestionFormValues } from './questionSchema'
import {
  useCreateQuestionsMutation,
  useGetQuestionsByIdsQuery,
  useUpdateQuestionMutation,
} from './questionsApi'

/** Thrown when a create is attempted before the subject uuid has resolved. */
export class SubjectUnresolvedError extends Error {
  constructor() {
    super('Still loading this test’s subject. Please try again in a moment.')
    this.name = 'SubjectUnresolvedError'
  }
}

/**
 * Owns the question-authoring session for one test: the taxonomy walk, the
 * slot arithmetic, and the save sequence that writes a new question back onto
 * its test. The screen composes this — it doesn't coordinate the three
 * features itself.
 */
export function useQuestionAuthoring(testId: string) {
  const [activeIndex, setActiveIndex] = useState(0)

  const { data: test, isLoading: isLoadingTest } = useGetTestQuery(testId, { skip: !testId })
  const questionIds = useMemo(() => test?.questions ?? [], [test])
  const { data: questions = [] } = useGetQuestionsByIdsQuery(questionIds, {
    skip: questionIds.length === 0,
  })

  const [createQuestions, createState] = useCreateQuestionsMutation()
  const [updateQuestion, updateState] = useUpdateQuestionMutation()
  const [updateTest] = useUpdateTestMutation()

  // Questions are written with the subject id, but a test reads back its name.
  const subjectId = useSubjectId(test?.subject)

  const { data: topics = [] } = useGetTopicsBySubjectQuery(subjectId ?? '', { skip: !subjectId })
  const { data: subTopics = [] } = useGetSubTopicsByTopicsQuery(
    topics.map((topic) => topic.id),
    { skip: topics.length === 0 },
  )
  const lookup = useMemo(() => ({ topics, subTopics }), [topics, subTopics])

  // A new question cannot be written until the subject name resolves to a uuid.
  const isSubjectPending = !subjectId && Boolean(test?.subject)

  /**
   * One slot per planned question. Saved questions can exceed that plan (the
   * count is editable after the fact), so the list grows to fit them — but it
   * never adds a spare slot beyond the planned total.
   */
  const plannedQuestions = test?.total_questions ?? 0
  const slotCount = Math.max(plannedQuestions, questions.length) || 1
  const completed = Array.from({ length: slotCount }, (_, index) => index < questions.length)
  const activeQuestion: Question | undefined = questions[activeIndex]

  async function save(values: QuestionFormValues) {
    if (activeQuestion) {
      await updateQuestion({
        id: activeQuestion.id,
        body: toUpdatePayload(values, lookup),
      }).unwrap()
      return
    }

    // The API requires a real subject uuid on create. It is resolved from the
    // test's subject *name*, so posting before that lookup lands would send an
    // empty subject. Saving is disabled while it resolves; throwing here keeps
    // the slot from advancing if that guard is ever bypassed.
    if (!subjectId) throw new SubjectUnresolvedError()

    const [created] = await createQuestions([
      toCreatePayload(values, testId, subjectId, lookup),
    ]).unwrap()

    if (created) {
      const nextIds = [...questionIds, created.id]
      // A test stores its own question ids, so the list is written back on
      // every add. `total_questions` only grows — authoring past the plan
      // raises it — and marks stay `correct_marks x total_questions`, the
      // same formula the test form derives, so the two never disagree.
      const nextTotalQuestions = Math.max(test?.total_questions ?? 0, nextIds.length)
      await updateTest({
        id: testId,
        body: {
          questions: nextIds,
          total_questions: nextTotalQuestions,
          total_marks: nextTotalQuestions * (test?.correct_marks ?? 0),
        },
      }).unwrap()
    }
  }

  return {
    test,
    isLoadingTest,
    topics,
    subTopics,
    activeIndex,
    activeQuestion,
    /** Form values for the active slot, or undefined for an unsaved one. */
    activeValues: activeQuestion ? questionToFormValues(activeQuestion, lookup) : undefined,
    questionCount: questions.length,
    slotCount,
    completed,
    isSaving: createState.isLoading || updateState.isLoading || isSubjectPending,
    saveError: createState.error ?? updateState.error,
    save,
    goTo: setActiveIndex,
    goPrevious: () => setActiveIndex((index) => Math.max(index - 1, 0)),
    goNext: () => setActiveIndex((index) => Math.min(index + 1, slotCount - 1)),
  }
}
