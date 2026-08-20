/**
 * Public surface of the taxonomy feature.
 * Other features import from '@/features/taxonomy' only — never deeper.
 */
export {
  useGetSubjectsQuery,
  useGetTopicsBySubjectQuery,
  useGetSubTopicsByTopicsQuery,
} from './taxonomyApi'
export { useSubjectId } from './useSubjectId'
