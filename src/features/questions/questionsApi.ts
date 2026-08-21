import { baseApi } from '@/app/baseApi'
import type { ApiEnvelope, Question, QuestionPayload } from '@/types'

/** Optional fields are omitted rather than nulled — see questionPayload.ts. */
type WritableQuestion = Partial<QuestionPayload> & { subject?: string }

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * There is no `GET /questions/test/:id`; a test only stores question ids,
     * so the saved set is resolved through the bulk fetch endpoint.
     */
    getQuestionsByIds: builder.query<Question[], string[]>({
      query: (questionIds) => ({
        url: '/questions/fetchBulk',
        method: 'POST',
        body: { question_ids: questionIds },
      }),
      transformResponse: (res: ApiEnvelope<Question[]>) => res.data,
      // Tagged per question, so editing one does not refetch every other
      // cached bulk request — only the ones actually holding that question.
      providesTags: (questions) =>
        questions
          ? [
              ...questions.map(({ id }) => ({ type: 'Question' as const, id })),
              { type: 'Question', id: 'LIST' },
            ]
          : [{ type: 'Question', id: 'LIST' }],
    }),

    createQuestions: builder.mutation<Question[], WritableQuestion[]>({
      query: (questions) => ({
        url: '/questions/bulk',
        method: 'POST',
        body: { questions },
      }),
      transformResponse: (res: ApiEnvelope<Question[]>) => res.data,
      // A new question belongs to no cached set yet, so only the list is stale.
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    }),

    updateQuestion: builder.mutation<Question, { id: string; body: WritableQuestion }>({
      query: ({ id, body }) => ({ url: `/questions/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiEnvelope<Question>) => res.data,
      invalidatesTags: (_question, _error, { id }) => [{ type: 'Question', id }],
    }),
  }),
})

export const { useGetQuestionsByIdsQuery, useCreateQuestionsMutation, useUpdateQuestionMutation } =
  questionsApi
