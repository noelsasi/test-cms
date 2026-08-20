import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Alert, Button, PageLoader } from '@/components/ui'
import { QuestionNavigator, useGetQuestionsByIdsQuery } from '@/features/questions'
import {
  PublishPanel,
  TestSummaryCard,
  useGetTestQuery,
  useUpdateTestMutation,
  type PublishSettings,
} from '@/features/tests'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'

export default function PreviewPage() {
  const { testId = '' } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const [isPublished, setIsPublished] = useState(false)

  const { data: test, isLoading } = useGetTestQuery(testId, { skip: !testId })
  const questionIds = test?.questions ?? []
  const { data: questions = [] } = useGetQuestionsByIdsQuery(questionIds, {
    skip: questionIds.length === 0,
  })

  const [updateTest, publishState] = useUpdateTestMutation()

  async function handlePublish(settings: PublishSettings) {
    await updateTest({
      id: testId,
      body: {
        status: settings.status,
        // Omitted rather than nulled — the API rejects an explicit null date.
        ...(settings.scheduledDate ? { scheduled_date: settings.scheduledDate } : {}),
        ...(settings.expiryDate ? { expiry_date: settings.expiryDate } : {}),
      },
    }).unwrap()

    setIsPublished(true)
    // Let the confirmation register before returning to the list.
    window.setTimeout(() => navigate(PATH_DASHBOARD.tests.root), 1500)
  }

  if (isLoading) return <PageLoader />
  if (!test) return <Alert>That test could not be loaded.</Alert>

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
          completed={questions.map(() => true)}
          activeIndex={-1}
          totalQuestions={test.total_questions}
          onSelect={(index) =>
            navigate(PATH_DASHBOARD.tests.questions(testId), { state: { questionIndex: index } })
          }
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold text-ink-900">Test created</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 px-3 py-1 text-xs font-medium text-success">
              All {questions.length} Questions done
            </span>
          </div>

          <TestSummaryCard test={test} />

          {isPublished ? (
            <Alert variant="success">
              Test published successfully. Returning to the test list…
            </Alert>
          ) : (
            <>
              {publishState.error && (
                <Alert>
                  {getApiErrorMessage(publishState.error, 'Could not publish the test.')}
                </Alert>
              )}

              <PublishPanel
                hasExistingExpiry={Boolean(test.expiry_date)}
                isPublishing={publishState.isLoading}
                onCancel={() => navigate(PATH_DASHBOARD.tests.root)}
                onConfirm={handlePublish}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
