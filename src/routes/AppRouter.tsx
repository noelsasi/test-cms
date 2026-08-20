import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routeObjects } from './routes'

const router = createBrowserRouter(routeObjects)

export function AppRouter() {
  return <RouterProvider router={router} />
}
