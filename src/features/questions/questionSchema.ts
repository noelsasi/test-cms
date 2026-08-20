import { z } from 'zod'

/** Optional text fields post as null rather than "" so the API stores a blank. */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? null : value))
  .nullable()

/**
 * The question body is rich-text HTML. Anything rendering it back must escape
 * or sanitize it — never pass it straight to `dangerouslySetInnerHTML`, since
 * the API stores whatever markup it is given.
 * An "empty" editor still yields markup
 * like `<p></p>`, so emptiness is judged on text content, not string length.
 */
const richText = z
  .string()
  .refine((value) => value.replace(/<[^>]*>/g, '').trim().length > 0 || /<img\b/i.test(value), {
    message: 'Question text is required',
  })

export const questionSchema = z.object({
  question: richText,
  option1: z.string().trim().min(1, 'Option 1 is required'),
  option2: z.string().trim().min(1, 'Option 2 is required'),
  option3: z.string().trim().min(1, 'Option 3 is required'),
  option4: z.string().trim().min(1, 'Option 4 is required'),
  correct_option: z.enum(['option1', 'option2', 'option3', 'option4'], {
    required_error: 'Select the correct option',
  }),
  explanation: optionalText,
  difficulty: z.enum(['easy', 'medium', 'difficult', 'hard']).nullable(),
  media_url: optionalText,
  topic: z.string().nullable(),
  sub_topic: z.string().nullable(),
})

export type QuestionFormValues = z.infer<typeof questionSchema>

export const CORRECT_OPTION_FIELDS = ['option1', 'option2', 'option3', 'option4'] as const

export const DEFAULT_QUESTION_VALUES: QuestionFormValues = {
  question: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correct_option: 'option1',
  explanation: null,
  difficulty: null,
  media_url: null,
  topic: null,
  sub_topic: null,
}
