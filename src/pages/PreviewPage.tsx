import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Alert, Button, PageLoader, useToast } from '@/components/ui'
import { QuestionNavigator, useGetQuestionsByIdsQuery } from '@/features/questions'
import {
  PublishPanel,
  TestSummaryCard,
  useGetTestQuery,
  useUpdateTestMutation,
  type PublishSettings,
} from '@/features/tests'
import { cn } from '@/lib/cn'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'

export default function PreviewPage() {
  const { testId = '' } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const { data: test, isLoading } = useGetTestQuery(testId, { skip: !testId })
  // Memoized: a fresh array each render would be a new RTK Query cache key.
  const questionIds = useMemo(() => test?.questions ?? [], [test])
  const { data: questions = [] } = useGetQuestionsByIdsQuery(questionIds, {
    skip: questionIds.length === 0,
  })

  const [updateTest, publishState] = useUpdateTestMutation()

  async function handlePublish(settings: PublishSettings) {
    try {
      await updateTest({
        id: testId,
        body: {
          status: settings.status,
          // Omitted rather than nulled — the API rejects an explicit null date.
          ...(settings.scheduledDate ? { scheduled_date: settings.scheduledDate } : {}),
          ...(settings.expiryDate ? { expiry_date: settings.expiryDate } : {}),
        },
      }).unwrap()
    } catch {
      // Surfaced from `publishState.error` below; stay on the page to retry.
      return
    }

    // The toast outlives the navigation, so the list can be shown at once
    // rather than holding the user here to read a confirmation.
    showToast('Test published successfully.')
    navigate(PATH_DASHBOARD.tests.root)
  }

  if (isLoading) return <PageLoader />
  if (!test) return <Alert>That test could not be loaded.</Alert>

  /**
   * One slot per planned question, matching the questions screen — a test can
   * be published short of its plan, so the navigator and the badge both have to
   * show the shortfall rather than implying every slot is filled.
   */
  const plannedQuestions = test.total_questions
  const slotCount = Math.max(plannedQuestions, questions.length) || 1
  const completed = Array.from({ length: slotCount }, (_, index) => index < questions.length)
  const isComplete = questions.length >= plannedQuestions

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Test Creation', to: PATH_DASHBOARD.tests.root },
          { label: test.name, to: PATH_DASHBOARD.tests.edit(testId) },
          { label: 'Preview & Publish' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => navigate(PATH_DASHBOARD.tests.edit(testId))}>
              Edit Test
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(PATH_DASHBOARD.tests.questions(testId))}
            >
              Edit Questions
            </Button>
          </div>
        }
      />

      <div className="flex flex-col items-start gap-5 lg:flex-row">
        <QuestionNavigator
          completed={completed}
          activeIndex={-1}
          totalQuestions={test.total_questions}
          onSelect={(index) =>
            navigate(PATH_DASHBOARD.tests.questions(testId), { state: { questionIndex: index } })
          }
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-ink-900">Test created</h1>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                isComplete
                  ? 'border-success/40 text-success'
                  : 'border-accent-amber/40 text-accent-amber',
              )}
            >
              {isComplete
                ? `All ${questions.length} Questions done`
                : `${questions.length} of ${plannedQuestions} Questions done`}
            </span>
          </div>

          {!isComplete && (
            <Alert>
              This test is planned for {plannedQuestions} question
              {plannedQuestions === 1 ? '' : 's'} but only {questions.length}{' '}
              {questions.length === 1 ? 'has' : 'have'} been authored. Publishing now makes it
              visible with the questions it currently has.
            </Alert>
          )}

          <TestSummaryCard test={test} />

          {publishState.error && (
            <Alert>{getApiErrorMessage(publishState.error, 'Could not publish the test.')}</Alert>
          )}

          <PublishPanel
            hasExistingExpiry={Boolean(test.expiry_date)}
            isPublishing={publishState.isLoading}
            onCancel={() => navigate(PATH_DASHBOARD.tests.root)}
            onConfirm={handlePublish}
          />
        </div>
      </div>
    </>
  )
}
