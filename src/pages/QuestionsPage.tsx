import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Alert, Button, PageLoader, useToast } from '@/components/ui'
import {
  QuestionForm,
  QuestionNavigator,
  SubjectUnresolvedError,
  useQuestionAuthoring,
  type QuestionFormValues,
} from '@/features/questions'
import { TestSummaryCard } from '@/features/tests'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'

export default function QuestionsPage() {
  const { testId = '' } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  // Save failures the mutation state cannot describe (e.g. taxonomy not ready).
  const [localError, setLocalError] = useState<string | null>(null)

  const authoring = useQuestionAuthoring(testId)

  async function handleSubmit(values: QuestionFormValues) {
    setLocalError(null)
    try {
      await authoring.save(values)
    } catch (error) {
      // RTK Query errors already render via `saveError`; anything else needs
      // its own message so the failure is never silent.
      if (error instanceof SubjectUnresolvedError) setLocalError(error.message)
      return
    }

    // Advancing the slot is the only other feedback, and on the last question
    // the index is clamped — so without this the save looks like a no-op.
    showToast(
      authoring.activeQuestion
        ? 'Question updated.'
        : `Question ${authoring.activeIndex + 1} saved.`,
    )
    authoring.goNext()
  }

  if (authoring.isLoadingTest) return <PageLoader />
  if (!authoring.test) return <Alert>That test could not be loaded.</Alert>

  const { test } = authoring

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
            disabled={authoring.questionCount === 0}
            onClick={() => navigate(PATH_DASHBOARD.tests.preview(testId))}
          >
            Publish
          </Button>
        }
      />

      <div className="flex flex-col items-start gap-5 lg:flex-row">
        <QuestionNavigator
          completed={authoring.completed}
          activeIndex={authoring.activeIndex}
          totalQuestions={test.total_questions}
          onSelect={authoring.goTo}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <TestSummaryCard test={test} />

          {authoring.saveError ? (
            <Alert>{getApiErrorMessage(authoring.saveError, 'Could not save the question.')}</Alert>
          ) : (
            localError && <Alert>{localError}</Alert>
          )}

          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
            <QuestionForm
              /* Remount so the form picks up the slot being edited. */
              key={authoring.activeQuestion?.id ?? `new-${authoring.activeIndex}`}
              defaultValues={authoring.activeValues}
              topics={authoring.topics}
              subTopics={authoring.subTopics}
              isSaving={authoring.isSaving}
              questionNumber={authoring.activeIndex + 1}
              totalQuestions={test.total_questions}
              canGoPrevious={authoring.activeIndex > 0}
              canGoNext={authoring.activeIndex < authoring.slotCount - 1}
              onPrevious={authoring.goPrevious}
              onNext={authoring.goNext}
              onSubmit={handleSubmit}
              onExit={() => navigate(PATH_DASHBOARD.tests.root)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
