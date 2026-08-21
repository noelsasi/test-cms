import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { Alert, PageLoader, useToast } from '@/components/ui'
import {
  TestForm,
  useCreateTestMutation,
  useGetTestQuery,
  useTestFormValues,
  useUpdateTestMutation,
  type TestFormValues,
} from '@/features/tests'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_DASHBOARD } from '@/routes/paths'

export default function TestFormPage() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const isEdit = Boolean(testId)

  const { data: test, isLoading: isLoadingTest } = useGetTestQuery(testId ?? '', { skip: !isEdit })
  const [createTest, createState] = useCreateTestMutation()
  const [updateTest, updateState] = useUpdateTestMutation()
  const { values, isResolving, unresolved } = useTestFormValues(test)
  // Both buttons drive the same mutations, so the pending flag says which one
  // to spin rather than lighting up the whole footer.
  const [pendingAction, setPendingAction] = useState<'next' | 'draft' | null>(null)

  async function saveTest(values: TestFormValues) {
    // `status` is omitted deliberately: the API rejects an explicit null and
    // defaults new tests to draft. Publishing happens on the preview screen.
    return isEdit
      ? await updateTest({ id: testId ?? '', body: values }).unwrap()
      : await createTest(values).unwrap()
  }

  async function handleSubmit(values: TestFormValues) {
    setPendingAction('next')
    try {
      const result = await saveTest(values)
      navigate(PATH_DASHBOARD.tests.questions(result.id))
    } catch {
      // Surfaced from the mutations' `error` state below.
    } finally {
      setPendingAction(null)
    }
  }

  /** Saves and returns to the list, leaving the test in its draft state. */
  async function handleSaveDraft(values: TestFormValues) {
    setPendingAction('draft')
    try {
      await saveTest(values)
      showToast('Draft saved successfully.')
    } catch {
      // Surfaced from the mutations' `error` state below.
    } finally {
      setPendingAction(null)
    }
  }

  if (isEdit && (isLoadingTest || isResolving)) return <PageLoader />

  return (
    <>
      <PageHeader
        crumbs={[
          { label: 'Test Creation', to: PATH_DASHBOARD.tests.root },
          { label: isEdit ? 'Edit Test' : 'Create Test' },
        ]}
      />

      {unresolved.length > 0 && (
        <Alert className="mb-4">
          {unresolved.length === 1 ? 'This topic is' : 'These topics are'} no longer in the subject
          list and cannot be saved back: {unresolved.join(', ')}. Saving will remove{' '}
          {unresolved.length === 1 ? 'it' : 'them'} from the test.
        </Alert>
      )}

      {isEdit && !test ? (
        <Alert>That test could not be loaded.</Alert>
      ) : (
        <TestForm
          /* RHF reads defaultValues once, so the resolved test needs a fresh
             mount rather than a prop update. */
          key={test?.id ?? 'new'}
          defaultValues={values}
          isSubmitting={pendingAction === 'next'}
          isSavingDraft={pendingAction === 'draft'}
          errorMessage={
            createState.error || updateState.error
              ? getApiErrorMessage(
                  createState.error ?? updateState.error,
                  'Could not save the test.',
                )
              : undefined
          }
          submitLabel={isEdit ? 'Save' : 'Next: Add Questions'}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          onCancel={() => navigate(PATH_DASHBOARD.tests.root)}
        />
      )}
    </>
  )
}
