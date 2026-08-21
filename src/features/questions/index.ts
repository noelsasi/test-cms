/**
 * Public surface of the questions feature.
 * Other features import from '@/features/questions' only — never deeper.
 */
export { QuestionForm } from './QuestionForm'
export { QuestionNavigator } from './QuestionNavigator'
export { toCreatePayload, toUpdatePayload, questionToFormValues } from './questionPayload'
export { type QuestionFormValues } from './questionSchema'
export { useQuestionAuthoring, SubjectUnresolvedError } from './useQuestionAuthoring'
export {
  useGetQuestionsByIdsQuery,
  useCreateQuestionsMutation,
  useUpdateQuestionMutation,
} from './questionsApi'
