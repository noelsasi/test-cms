import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, Topbar } from '@/components/layout'
import { STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/storage'

/**
 * Shell for authenticated screens: the sidebar is a docked column from `lg`
 * up and an off-canvas drawer below it, with a sticky topbar and a scrollable
 * content column that each page fills with its own header.
 */
export default function DashboardLayout() {
  // Persisted so the choice survives navigation and reloads. Desktop only —
  // the mobile drawer is transient and always opens expanded.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => storage.get(STORAGE_KEYS.sidebarCollapsed) === 'true',
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { pathname } = useLocation()
  const [drawerPathname, setDrawerPathname] = useState(pathname)

  // Navigating is the drawer's natural dismissal — leaving it open would cover
  // the page the user just asked for. Derived during render rather than in an
  // effect, so it never triggers a second render pass.
  if (pathname !== drawerPathname) {
    setDrawerPathname(pathname)
    if (isDrawerOpen) setIsDrawerOpen(false)
  }

  // Escape closes the drawer, matching the dialog-like way it behaves.
  useEffect(() => {
    if (!isDrawerOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsDrawerOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  function toggleSidebar() {
    setIsSidebarCollapsed((collapsed) => {
      const next = !collapsed
      storage.set(STORAGE_KEYS.sidebarCollapsed, String(next))
      return next
    })
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      {isDrawerOpen && (
        <div
          /* Decorative scrim: Escape and the close button carry the semantics. */
          aria-hidden
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-ink-900/40 lg:hidden"
        />
      )}

      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isDrawerOpen={isDrawerOpen}
        onCloseDrawer={() => setIsDrawerOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenNav={() => setIsDrawerOpen(true)} />
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
