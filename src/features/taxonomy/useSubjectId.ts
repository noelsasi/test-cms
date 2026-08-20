import { useGetSubjectsQuery } from './taxonomyApi'

/**
 * Resolves a subject display name to its id. Tests read back `subject` as a
 * name, but writes — including question creation — need the uuid.
 */
export function useSubjectId(subjectName: string | undefined): string | undefined {
  const { data: subjects = [] } = useGetSubjectsQuery(undefined, { skip: !subjectName })

  if (!subjectName) return undefined

  // Already an id (writes echo uuids back), so no lookup is needed.
  if (subjects.some((subject) => subject.id === subjectName)) return subjectName

  return subjects.find((subject) => subject.name === subjectName)?.id
}
