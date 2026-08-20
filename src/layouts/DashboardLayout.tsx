import { Outlet } from 'react-router-dom'

/**
 * Shell for authenticated screens. The sidebar and topbar from the Figma
 * will live here; for now it just renders the active route.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
