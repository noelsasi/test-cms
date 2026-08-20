import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/storage'
import type { LoginResponse, User } from '@/types'
import type { RootState } from '@/app/store'

interface AuthState {
  token: string | null
  user: User | null
}

/**
 * Seeded from localStorage so a refresh keeps the session without a flash of
 * the login screen. Storage stays the source of truth for `baseApi`'s header.
 */
function readStoredUser(): User | null {
  const raw = storage.get(STORAGE_KEYS.user)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    // Corrupt entry — treat as signed out rather than crashing on boot.
    storage.remove(STORAGE_KEYS.user)
    return null
  }
}

const initialState: AuthState = {
  token: storage.get(STORAGE_KEYS.token),
  user: readStoredUser(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionStarted(state, action: PayloadAction<LoginResponse>) {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      storage.set(STORAGE_KEYS.token, token)
      storage.set(STORAGE_KEYS.user, JSON.stringify(user))
    },
    /** Also dispatched by `baseApi` when the API answers 401. */
    sessionExpired(state) {
      state.token = null
      state.user = null
      storage.remove(STORAGE_KEYS.token)
      storage.remove(STORAGE_KEYS.user)
    },
  },
})

export const { sessionStarted, sessionExpired } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token)
export const selectCurrentUser = (state: RootState) => state.auth.user
