import { baseApi } from '@/app/baseApi'
import type { ApiEnvelope, Test, TestPayload } from '@/types'

export const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query<Test[], void>({
      query: () => '/tests',
      transformResponse: (res: ApiEnvelope<Test[]>) => res.data,
      providesTags: (tests) =>
        tests
          ? [
              ...tests.map(({ id }) => ({ type: 'Test' as const, id })),
              { type: 'Test', id: 'LIST' },
            ]
          : [{ type: 'Test', id: 'LIST' }],
    }),

    getTest: builder.query<Test, string>({
      query: (id) => `/tests/${id}`,
      transformResponse: (res: ApiEnvelope<Test>) => res.data,
      providesTags: (_test, _error, id) => [{ type: 'Test', id }],
    }),

    createTest: builder.mutation<Test, TestPayload>({
      query: (body) => ({ url: '/tests', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Test>) => res.data,
      invalidatesTags: [{ type: 'Test', id: 'LIST' }],
    }),

    /** Cascades: the API deletes the test's questions along with it. */
    deleteTest: builder.mutation<void, string>({
      query: (id) => ({ url: `/tests/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Test', id: 'LIST' }],
    }),

    updateTest: builder.mutation<Test, { id: string; body: Partial<TestPayload> }>({
      query: ({ id, body }) => ({ url: `/tests/${id}`, method: 'PUT', body }),
      transformResponse: (res: ApiEnvelope<Test>) => res.data,
      invalidatesTags: (_test, _error, { id }) => [
        { type: 'Test', id },
        { type: 'Test', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetTestsQuery,
  useGetTestQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
} = testsApi
