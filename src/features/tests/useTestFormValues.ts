import { useMemo } from 'react'
import {
  useGetSubTopicsByTopicsQuery,
  useGetSubjectsQuery,
  useGetTopicsBySubjectQuery,
} from '@/features/taxonomy'
import type { Test } from '@/types'
import { subjectIdForName, testToFormValues } from './testFormValues'
import { DEFAULT_TEST_VALUES, type TestFormValues } from './testSchema'

/**
 * Resolves an existing test into form values. Because the API returns display
 * names, the taxonomy has to be walked in order — subject, then its topics,
 * then those topics' sub-topics — before names can be mapped back to ids.
 */
export function useTestFormValues(test: Test | undefined): {
  values: TestFormValues | undefined
  isResolving: boolean
  /** Names the taxonomy no longer knows — see `testToFormValues`. */
  unresolved: string[]
} {
  const { data: subjects = [], isFetching: isFetchingSubjects } = useGetSubjectsQuery(undefined, {
    skip: !test,
  })

  const subjectId = test ? subjectIdForName(test.subject, subjects) : undefined

  const { data: topics = [], isFetching: isFetchingTopics } = useGetTopicsBySubjectQuery(
    subjectId ?? '',
    { skip: !subjectId },
  )

  const topicIds = useMemo(
    () =>
      (test?.topics ?? []).flatMap((name) => {
        const match = topics.find((topic) => topic.name === name)
        return match ? [match.id] : []
      }),
    [test, topics],
  )

  const { data: subTopics = [], isFetching: isFetchingSubTopics } = useGetSubTopicsByTopicsQuery(
    topicIds,
    { skip: topicIds.length === 0 },
  )

  const resolved = useMemo(() => {
    if (!test) return undefined
    return testToFormValues(test, subjects, topics, subTopics)
  }, [test, subjects, topics, subTopics])

  if (!test) return { values: DEFAULT_TEST_VALUES, isResolving: false, unresolved: [] }

  const isResolving = isFetchingSubjects || isFetchingTopics || isFetchingSubTopics

  return {
    values: resolved?.values,
    isResolving,
    // While a fetch is in flight the lists are incomplete, so every name looks
    // unresolved — only report once the taxonomy has actually settled.
    unresolved: isResolving ? [] : (resolved?.unresolved ?? []),
  }
}
