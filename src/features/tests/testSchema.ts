import { z } from 'zod'

/** Marks and duration arrive from number inputs, so coerce before validating. */
const marks = z.coerce.number({ invalid_type_error: 'Enter a number' })

export const testSchema = z.object({
  name: z.string().trim().min(1, 'Test name is required'),
  type: z.enum(['chapterwise', 'pyq', 'mock']),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  sub_topics: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'difficult', 'hard']),
  correct_marks: marks.min(0, 'Correct marks cannot be negative'),
  wrong_marks: marks.max(0, 'Wrong marks should be zero or negative'),
  unattempt_marks: marks,
  total_time: marks.int('Enter whole minutes').positive('Duration is required'),
  total_questions: marks.int().positive('Number of questions is required'),
  total_marks: marks.positive('Total marks is required'),
})

export type TestFormValues = z.infer<typeof testSchema>

export const TEST_TYPE_TABS = [
  { value: 'chapterwise', label: 'Chapterwise' },
  { value: 'pyq', label: 'PYQ' },
  { value: 'mock', label: 'Mock Test' },
] as const

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'difficult', label: 'Difficult' },
]

export const DEFAULT_TEST_VALUES: TestFormValues = {
  name: '',
  type: 'chapterwise',
  subject: '',
  topics: [],
  sub_topics: [],
  difficulty: 'easy',
  correct_marks: 5,
  wrong_marks: -1,
  unattempt_marks: 0,
  total_time: 0,
  total_questions: 0,
  total_marks: 0,
}
