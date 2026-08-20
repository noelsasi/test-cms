/** Keys for browser storage. Kept in one place so nothing hardcodes a string. */
export const STORAGE_KEYS = {
  token: 'preproute.token',
  user: 'preproute.user',
} as const

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  testCreate: '/tests/new',
  testEdit: (id: string) => `/tests/${id}/edit`,
  testQuestions: (id: string) => `/tests/${id}/questions`,
  testPreview: (id: string) => `/tests/${id}/preview`,
} as const
