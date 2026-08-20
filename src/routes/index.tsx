import { createBrowserRouter, Navigate } from 'react-router-dom'

import {
  LoginPage,
  DashboardPage,
  TestFormPage,
  QuestionsPage,
  PreviewPage,
  NotFoundPage,
} from './elements'
import { DashboardLayout } from '../layouts'
import AuthGuard from '../features/auth/guard/AuthGuard'
import { PATH_AFTER_LOGIN } from './paths'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    index: true,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: 'tests',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to={PATH_AFTER_LOGIN} replace /> },
      { path: 'new', element: <TestFormPage /> },
      { path: ':testId/edit', element: <TestFormPage /> },
      { path: ':testId/questions', element: <QuestionsPage /> },
      { path: ':testId/preview', element: <PreviewPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default router
