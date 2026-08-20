import { baseApi } from '@/app/baseApi'
import type { ApiEnvelope, LoginResponse } from '@/types'

export interface LoginCredentials {
  userId: string
  password: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (res: ApiEnvelope<LoginResponse>) => res.data,
    }),
  }),
})

export const { useLoginMutation } = authApi
