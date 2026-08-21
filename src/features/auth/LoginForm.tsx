import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Alert, Button, Input } from '@/components/ui'
import { useAppDispatch } from '@/app/hooks'
import { getApiErrorMessage } from '@/lib/apiError'
import { PATH_AFTER_LOGIN } from '@/routes/paths'
import { useLoginMutation } from './authApi'
import { sessionStarted } from './authSlice'
import { loginSchema, type LoginFormValues } from './loginSchema'

interface LocationState {
  from?: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      const session = await login(values).unwrap()
      dispatch(sessionStarted(session))
      // Return the user to whatever the guard interrupted, if anything.
      const { from } = (location.state ?? {}) as LocationState
      navigate(from ?? PATH_AFTER_LOGIN, { replace: true })
    } catch {
      // Surfaced from the mutation's `error` below.
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {error && <Alert>{getApiErrorMessage(error, 'Login failed. Please try again.')}</Alert>}

      <Input
        label="User ID"
        placeholder="Enter User ID"
        autoComplete="username"
        autoFocus
        error={errors.userId?.message}
        {...register('userId')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* No recovery flow on the API yet — shown for parity with the Figma,
          but inert rather than a link that navigates nowhere. */}
      <span className="-mt-2 text-sm text-ink-400" title="Contact your administrator to reset it">
        Forgot password?
      </span>

      <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
        {isLoading ? 'Signing in…' : 'Login'}
      </Button>
    </form>
  )
}
