import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Alert, Button, PageLoader } from '@/components/ui'
import {
  QuestionForm,
  QuestionNavigator,
  toCreatePayload,
  toUpdatePayload,
  useCreateQuestionsMutation,
  useGetQuestionsByIdsQuery,
  useUpdateQuestionMutation,
  type QuestionFormValues,
} from '@/features/questions'
import { TestSummaryCard, useGetTestQuery, useUpdateTestMutation } from '@/features/tests'
import {
  useGetSubTopicsByTopicsQuery,
  useGetTopicsBySubjectQuery,
  useSubjectId,
} from '@/features/taxonomy'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'
import type { Question, SubTopic, Topic } from '@/types'

export default function QuestionsPage() {
  const { testId = '' } = useParams<{ testId: string }>()
  const navigate = useNavigate()
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

  /**
   * One slot per planned question. Saved questions can exceed that plan (the
   * count is editable after the fact), so the list grows to fit them — but it
   * never adds a spare slot beyond the planned total.
   */
  const plannedQuestions = test?.total_questions ?? 0
  const slotCount = Math.max(plannedQuestions, questions.length) || 1
  const completed = Array.from({ length: slotCount }, (_, index) => index < questions.length)
  const activeQuestion: Question | undefined = questions[activeIndex]

  async function handleSubmit(values: QuestionFormValues) {
    if (activeQuestion) {
      await updateQuestion({
        id: activeQuestion.id,
        body: toUpdatePayload(values, { topics, subTopics }),
      }).unwrap()
    } else {
      const [created] = await createQuestions([
        toCreatePayload(values, testId, subjectId ?? '', { topics, subTopics }),
      ]).unwrap()

      if (created) {
        const nextIds = [...questionIds, created.id]
        // A test stores its own question ids, so the list is written back on
        // every add; marks follow the per-question value from its scheme.
        await updateTest({
          id: testId,
          body: {
            questions: nextIds,
            total_questions: Math.max(test?.total_questions ?? 0, nextIds.length),
            total_marks: nextIds.length * (test?.correct_marks ?? 0),
          },
        }).unwrap()
      }
    }

    setActiveIndex((index) => Math.min(index + 1, slotCount - 1))
  }

  if (isLoadingTest) return <PageLoader />
  if (!test) return <Alert>That test could not be loaded.</Alert>

  const saveError = createState.error ?? updateState.error

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Test Creation', to: PATH_DASHBOARD.tests.root },
          { label: 'Create Test', to: PATH_DASHBOARD.tests.edit(testId) },
          { label: 'Add Questions' },
        ]}
        actions={
          <Button
            disabled={questions.length === 0}
            onClick={() => navigate(PATH_DASHBOARD.tests.preview(testId))}
          >
            Publish
          </Button>
        }
      />

      <div className="flex flex-col items-start gap-5 lg:flex-row">
        <QuestionNavigator
          completed={completed}
          activeIndex={activeIndex}
          totalQuestions={test.total_questions}
          onSelect={setActiveIndex}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <TestSummaryCard test={test} />

          {saveError && (
            <Alert>{getApiErrorMessage(saveError, 'Could not save the question.')}</Alert>
          )}

          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <QuestionForm
              /* Remount so the form picks up the slot being edited. */
              key={activeQuestion?.id ?? `new-${activeIndex}`}
              defaultValues={
                activeQuestion ? questionToFormValues(activeQuestion, topics, subTopics) : undefined
              }
              topics={topics}
              subTopics={subTopics}
              isSaving={createState.isLoading || updateState.isLoading}
              questionNumber={activeIndex + 1}
              totalQuestions={test.total_questions}
              canGoPrevious={activeIndex > 0}
              canGoNext={activeIndex < slotCount - 1}
              onPrevious={() => setActiveIndex((index) => Math.max(index - 1, 0))}
              onNext={() => setActiveIndex((index) => Math.min(index + 1, slotCount - 1))}
              onSubmit={handleSubmit}
              onExit={() => navigate(PATH_DASHBOARD.tests.root)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

/** Questions store topic/sub-topic as names; the selects are keyed by id. */
function idForName(name: string | null, items: { id: string; name: string }[]): string | null {
  if (!name) return null
  return items.find((item) => item.name === name)?.id ?? null
}

function questionToFormValues(
  question: Question,
  topics: Topic[],
  subTopics: SubTopic[],
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
    topic: idForName(question.topic, topics),
    sub_topic: idForName(question.sub_topic, subTopics),
  }
}
