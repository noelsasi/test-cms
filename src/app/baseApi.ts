import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { env } from '@/lib/env'
import { STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/storage'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers) => {
    const token = storage.get(STORAGE_KEYS.token)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

/**
 * Wraps the base query so an expired/invalid JWT clears the session once,
 * centrally, instead of every screen handling 401 on its own.
 */
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    storage.remove(STORAGE_KEYS.token)
    storage.remove(STORAGE_KEYS.user)
    api.dispatch({ type: 'auth/sessionExpired' })
  }

  return result
}

/**
 * Single API slice. Feature endpoints are attached via `injectEndpoints`
 * so each feature owns its own queries without this file growing.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Test', 'Question', 'Subject', 'Topic', 'SubTopic'],
  endpoints: () => ({}),
})
