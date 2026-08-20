import { baseApi } from '@/app/baseApi'
import type { ApiEnvelope, SubTopic, Subject, Topic } from '@/types'

export const taxonomyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => '/subjects',
      transformResponse: (res: ApiEnvelope<Subject[]>) => res.data,
      providesTags: ['Subject'],
    }),

    getTopicsBySubject: builder.query<Topic[], string>({
      query: (subjectId) => `/topics/subject/${subjectId}`,
      transformResponse: (res: ApiEnvelope<Topic[]>) => res.data,
      providesTags: ['Topic'],
    }),

    /**
     * Sub-topics for several topics at once. The response spans every topic
     * asked for, with each row carrying its own `topic_id`.
     */
    getSubTopicsByTopics: builder.query<SubTopic[], string[]>({
      query: (topicIds) => ({
        url: '/sub-topics/multi-topics',
        method: 'POST',
        body: { topicIds },
      }),
      transformResponse: (res: ApiEnvelope<SubTopic[]>) => res.data,
      providesTags: ['SubTopic'],
    }),
  }),
})

export const { useGetSubjectsQuery, useGetTopicsBySubjectQuery, useGetSubTopicsByTopicsQuery } =
  taxonomyApi
