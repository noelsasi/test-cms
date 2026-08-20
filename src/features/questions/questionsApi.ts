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
      providesTags: ['Question'],
    }),

    createQuestions: builder.mutation<Question[], WritableQuestion[]>({
      query: (questions) => ({
        url: '/questions/bulk',
        method: 'POST',
        body: { questions },
      }),
      transformResponse: (res: ApiEnvelope<Question[]>) => res.data,
      invalidatesTags: ['Question'],
    }),

    updateQuestion: builder.mutation<Question, { id: string; body: WritableQuestion }>({
      query: ({ id, body }) => ({ url: `/questions/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiEnvelope<Question>) => res.data,
      invalidatesTags: ['Question'],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({ url: `/questions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Question'],
    }),
  }),
})

export const {
  useGetQuestionsByIdsQuery,
  useCreateQuestionsMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi
