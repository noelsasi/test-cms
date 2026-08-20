import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, RichTextEditor, Select, TrashIcon } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { SubTopic, Topic } from '@/types'
import {
  CORRECT_OPTION_FIELDS,
  DEFAULT_QUESTION_VALUES,
  questionSchema,
  type QuestionFormValues,
} from './questionSchema'

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'difficult', label: 'Difficult' },
]

interface QuestionFormProps {
  defaultValues?: QuestionFormValues
  topics: Topic[]
  subTopics: SubTopic[]
  isSaving?: boolean
  /** Position of the slot being edited, e.g. 4 of 50. */
  questionNumber: number
  totalQuestions: number
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: (values: QuestionFormValues) => void
  onExit: () => void
}

export function QuestionForm({
  defaultValues = DEFAULT_QUESTION_VALUES,
  topics,
  subTopics,
  isSaving = false,
  questionNumber,
  totalQuestions,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  onSubmit,
  onExit,
}: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues,
  })

  const selectedTopic = watch('topic')
  const correctOption = watch('correct_option')

  // Sub-topics are scoped to the chosen topic; without one, offer none.
  const availableSubTopics = selectedTopic
    ? subTopics.filter((sub) => sub.topic_id === selectedTopic)
    : []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink-900">
          Question {questionNumber}
          <span className="text-ink-400">/{totalQuestions || '—'}</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-field)] bg-canvas px-3 py-1.5 text-sm text-ink-500">
            + MCQ
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => reset(DEFAULT_QUESTION_VALUES)}
        className="flex w-fit items-center gap-1.5 text-sm text-danger transition-colors hover:underline"
      >
        <TrashIcon />
        Delete All Edits
      </button>

      <Controller
        control={control}
        name="question"
        render={({ field }) => (
          <RichTextEditor
            placeholder="Type here"
            error={errors.question?.message}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium text-ink-900">Type the options below</legend>
        {CORRECT_OPTION_FIELDS.map((field, index) => (
          <div key={field} className="flex items-center gap-3">
            <Controller
              control={control}
              name="correct_option"
              render={({ field: radio }) => (
                <input
                  type="radio"
                  checked={radio.value === field}
                  onChange={() => radio.onChange(field)}
                  aria-label={`Mark option ${index + 1} correct`}
                  className="size-4 shrink-0 accent-brand-600"
                />
              )}
            />
            <div className="relative flex-1">
              <input
                placeholder="Type Option here"
                aria-label={`Option ${index + 1}`}
                aria-invalid={errors[field] ? true : undefined}
                className={cn(
                  'w-full rounded-[var(--radius-field)] border bg-surface px-3 py-2.5 pr-10 text-sm text-ink-900',
                  'placeholder:text-ink-400 focus:outline-2 focus:outline-offset-0 focus:outline-brand-600',
                  errors[field]
                    ? 'border-danger'
                    : correctOption === field
                      ? 'border-success'
                      : 'border-line',
                )}
                {...register(field)}
              />
              <button
                type="button"
                onClick={() => setValue(field, '')}
                aria-label={`Clear option ${index + 1}`}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-danger"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        {CORRECT_OPTION_FIELDS.map((field) =>
          errors[field] ? (
            <p key={`${field}-error`} className="text-sm text-danger">
              {errors[field]?.message}
            </p>
          ) : null,
        )}
      </fieldset>

      <Controller
        control={control}
        name="explanation"
        render={({ field }) => (
          <RichTextEditor
            label="Add Solution"
            placeholder="Type here"
            minHeightClassName="min-h-40"
            error={errors.explanation?.message}
            value={field.value ?? ''}
            onChange={(html) => field.onChange(html || null)}
          />
        )}
      />

      {/* Step between slots without leaving the form. */}
      <div className="flex items-center justify-center gap-16">
        <StepArrow direction="previous" disabled={!canGoPrevious} onClick={onPrevious} />
        <StepArrow direction="next" disabled={!canGoNext} onClick={onNext} />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-ink-900">Question settings</h3>

        <Controller
          control={control}
          name="difficulty"
          render={({ field }) => (
            <Select
              label="Level of Difficulty"
              options={DIFFICULTY_OPTIONS}
              placeholder="Select from Drop-down"
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value || null)}
            />
          )}
        />

        <Controller
          control={control}
          name="topic"
          render={({ field }) => (
            <Select
              label="Topic"
              options={topics.map((topic) => ({ value: topic.id, label: topic.name }))}
              placeholder="Select from Drop-down"
              value={field.value ?? ''}
              onChange={(event) => {
                field.onChange(event.target.value || null)
                // The old sub-topic belongs to the previous topic.
                setValue('sub_topic', null)
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="sub_topic"
          render={({ field }) => (
            <Select
              label="Sub-topic"
              options={availableSubTopics.map((sub) => ({ value: sub.id, label: sub.name }))}
              placeholder={selectedTopic ? 'Select from Drop-down' : 'Select a topic first'}
              disabled={availableSubTopics.length === 0}
              value={field.value ?? ''}
              onChange={(event) => field.onChange(event.target.value || null)}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="danger" onClick={onExit}>
          Exit Test Creation
        </Button>
        <Button type="submit" isLoading={isSaving}>
          Next
        </Button>
      </div>
    </form>
  )
}

function StepArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'previous' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'previous' ? 'Previous question' : 'Next question'}
      className="text-ink-400 transition-colors hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path d={direction === 'previous' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
      </svg>
    </button>
  )
}
