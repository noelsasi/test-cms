/**
 * Public surface of the auth feature.
 * Other features import from '@/features/auth' only — never deeper.
 */
export { LoginForm } from './LoginForm'
export { LoginIllustration } from './LoginIllustration'
export { useLoginMutation } from './authApi'
export {
  authReducer,
  sessionStarted,
  sessionExpired,
  selectCurrentUser,
  selectIsAuthenticated,
} from './authSlice'
export { default as AuthGuard } from './guard/AuthGuard'
