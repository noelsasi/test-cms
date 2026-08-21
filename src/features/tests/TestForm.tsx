import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Button,
  Input,
  MultiSelect,
  NumberStepper,
  RadioGroup,
  Select,
  Tabs,
} from '@/components/ui'
import {
  useGetSubTopicsByTopicsQuery,
  useGetSubjectsQuery,
  useGetTopicsBySubjectQuery,
} from '@/features/taxonomy'
import {
  DEFAULT_TEST_VALUES,
  DIFFICULTY_OPTIONS,
  TEST_TYPE_TABS,
  testSchema,
  type TestFormValues,
} from './testSchema'

interface TestFormProps {
  defaultValues?: TestFormValues
  isSubmitting?: boolean
  errorMessage?: string
  submitLabel?: string
  isSavingDraft?: boolean
  /**
   * Saves without advancing to the questions step. Runs the same validation as
   * submit, so a draft is always a well-formed test.
   */
  onSaveDraft?: (values: TestFormValues) => void
  onSubmit: (values: TestFormValues) => void
  onCancel: () => void
}

export function TestForm({
  defaultValues = DEFAULT_TEST_VALUES,
  isSubmitting = false,
  errorMessage,
  submitLabel = 'Next',
  isSavingDraft = false,
  onSaveDraft,
  onSubmit,
  onCancel,
}: TestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues,
  })

  const subjectId = watch('subject')
  const topicIds = watch('topics')

  /**
   * Total marks is correct marks x number of questions — the questions screen
   * recomputes it that way as questions are saved, so the form derives it
   * rather than letting the two disagree.
   */
  const correctMarks = watch('correct_marks')
  const totalQuestions = watch('total_questions')
  const derivedTotalMarks = (Number(correctMarks) || 0) * (Number(totalQuestions) || 0)

  // Kept in the form state so submit sends the derived figure, not a stale one.
  useEffect(() => {
    setValue('total_marks', derivedTotalMarks, { shouldValidate: false })
  }, [derivedTotalMarks, setValue])

  const { data: subjects = [], isLoading: isLoadingSubjects } = useGetSubjectsQuery()
  const { data: topics = [] } = useGetTopicsBySubjectQuery(subjectId, { skip: !subjectId })
  const { data: subTopics = [] } = useGetSubTopicsByTopicsQuery(topicIds, {
    skip: topicIds.length === 0,
  })

  const toOptions = (items: { id: string; name: string }[]) =>
    items.map((item) => ({ value: item.id, label: item.name }))

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-surface p-6"
    >
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <Tabs items={[...TEST_TYPE_TABS]} value={field.value} onChange={field.onChange} />
        )}
      />

      <div className="grid gap-x-10 gap-y-5 lg:grid-cols-2">
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select
              label="Subject"
              options={toOptions(subjects)}
              error={errors.subject?.message}
              placeholder={isLoadingSubjects ? 'Loading subjects…' : 'Choose from Drop-down'}
              value={field.value}
              onChange={(event) => {
                field.onChange(event.target.value)
                // Topics belong to the old subject, and sub-topics to the old
                // topics — both are meaningless once the subject changes.
                setValue('topics', [])
                setValue('sub_topics', [])
              }}
            />
          )}
        />

        <Input
          label="Name of Test"
          placeholder="Enter name of Test"
          error={errors.name?.message}
          {...register('name')}
        />

        <Controller
          control={control}
          name="topics"
          render={({ field }) => (
            <MultiSelect
              label="Topic"
              options={toOptions(topics)}
              value={field.value}
              error={errors.topics?.message}
              emptyHint="Select a subject first"
              onChange={(next) => {
                field.onChange(next)
                // Drop sub-topics whose parent topic is no longer selected.
                setValue(
                  'sub_topics',
                  getValues('sub_topics').filter((id) =>
                    subTopics.some((sub) => sub.id === id && next.includes(sub.topic_id)),
                  ),
                )
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="sub_topics"
          render={({ field }) => (
            <MultiSelect
              label="Sub Topic"
              options={toOptions(subTopics)}
              value={field.value}
              error={errors.sub_topics?.message}
              emptyHint="Select a topic first"
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="total_time"
          render={({ field }) => (
            <Input
              label="Duration (Minutes)"
              type="number"
              placeholder="Enter the time"
              error={errors.total_time?.message}
              value={field.value || ''}
              onChange={(event) => field.onChange(Number(event.target.value))}
            />
          )}
        />

        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <RadioGroup
              label="Test Difficulty Level"
              options={DIFFICULTY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.difficulty?.message}
            />
          )}
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-ink-900">Marking Scheme:</p>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
          <Controller
            control={control}
            name="wrong_marks"
            render={({ field }) => (
              <NumberStepper
                label="Wrong Answer"
                value={field.value}
                onChange={field.onChange}
                max={0}
                error={errors.wrong_marks?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="unattempt_marks"
            render={({ field }) => (
              <NumberStepper
                label="Unattempted"
                value={field.value}
                onChange={field.onChange}
                showSign
                error={errors.unattempt_marks?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="correct_marks"
            render={({ field }) => (
              <NumberStepper
                label="Correct Answer"
                value={field.value}
                onChange={field.onChange}
                min={0}
                showSign
                error={errors.correct_marks?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="total_questions"
            render={({ field }) => (
              <Input
                label="No of Questions"
                type="number"
                placeholder="Ex:50"
                error={errors.total_questions?.message}
                value={field.value || ''}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            )}
          />
          {/* Derived, not entered: the questions screen recomputes total_marks
              from the saved question count on every add, so a typed value would
              be silently replaced. Shown read-only to keep the number visible. */}
          <Input
            label="Total Marks"
            type="number"
            readOnly
            tabIndex={-1}
            className="cursor-not-allowed bg-brand-50 text-ink-500"
            title="Calculated from correct marks x number of questions"
            error={errors.total_marks?.message}
            value={derivedTotalMarks || ''}
            onChange={() => {}}
          />
        </div>
      </div>

      {errorMessage && <Alert>{errorMessage}</Alert>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting || isSavingDraft}>
          Cancel
        </Button>
        {onSaveDraft && (
          <Button
            variant="secondary"
            /* Not type="submit", so the draft path never advances the flow. */
            onClick={handleSubmit(onSaveDraft)}
            isLoading={isSavingDraft}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
        )}
        <Button type="submit" isLoading={isSubmitting} disabled={isSavingDraft}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
