import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/ui'
import { PATH_DASHBOARD } from '@/routes/paths'

interface NavItem {
  label: string
  to: string
  icon: 'dashboard' | 'create' | 'tracking'
  /** Shown for parity with the Figma, but outside this task's five screens. */
  isPlanned?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: PATH_DASHBOARD.root, icon: 'dashboard' },
  { label: 'Test Creation', to: PATH_DASHBOARD.tests.root, icon: 'create' },
  { label: 'Test Tracking', to: PATH_DASHBOARD.tracking, icon: 'tracking', isPlanned: true },
]

/** Inline so the shell carries no icon-library dependency. */
function NavIcon({ name }: { name: NavItem['icon'] }) {
  const common = {
    className: 'size-5 shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }

  if (name === 'dashboard') {
    return (
      <svg {...common}>
        <path d="M3 17l6-6 4 4 7-7" />
        <path d="M17 8h4v4" />
      </svg>
    )
  }

  if (name === 'create') {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z" />
      <path d="M6 5h12a1 1 0 011 1v13a1 1 0 01-1 1H6a1 1 0 01-1-1V6a1 1 0 011-1z" />
      <path d="M9 11l2 2 4-4" />
    </svg>
  )
}

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  /** Drawer state, used only below `lg` where the sidebar is off-canvas. */
  isDrawerOpen: boolean
  onCloseDrawer: () => void
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isDrawerOpen,
  onCloseDrawer,
}: SidebarProps) {
  return (
    <aside
      /* Below `lg` this is a fixed drawer that slides in; from `lg` it returns
         to a docked column and the transform is irrelevant. */
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col border-r border-line bg-surface transition-transform duration-200',
        'lg:static lg:z-auto lg:shrink-0 lg:translate-x-0 lg:transition-[width]',
        isDrawerOpen ? 'translate-x-0' : '-translate-x-full',
        isCollapsed ? 'lg:w-20' : 'lg:w-64',
      )}
    >
      <div
        className={cn(
          'flex h-20 items-center gap-2',
          'justify-between px-6',
          isCollapsed && 'lg:flex-col lg:justify-center lg:px-2 lg:pt-3',
        )}
      >
        {/* Keep a brand anchor when the wordmark no longer fits. */}
        <Logo className={cn('h-8', isCollapsed && 'lg:hidden')} />
        {isCollapsed && (
          /* The nib mark stands in for the wordmark once the rail narrows. */
          <img
            src="/favicon.png"
            alt="PrepRoute"
            width={512}
            height={512}
            className="hidden size-8 object-contain lg:block"
          />
        )}
        <button
          type="button"
          onClick={onCloseDrawer}
          aria-label="Close navigation"
          className="grid size-8 shrink-0 place-items-center rounded-[var(--radius-field)] text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600 lg:hidden"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className="hidden size-8 shrink-0 place-items-center rounded-[var(--radius-field)] text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600 lg:grid"
        >
          <svg
            className={cn('size-4 transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-1 py-4">
        {NAV_ITEMS.map((item) =>
          /* Rendered inert rather than linked — the route doesn't exist, and a
             nav item that lands on "not found" reads worse than a disabled one. */
          item.isPlanned ? (
            <span
              key={item.to}
              title={`${item.label} — coming soon`}
              aria-disabled
              className={cn(
                'relative flex cursor-not-allowed items-center gap-3 px-6 py-3 text-sm font-medium text-ink-400',
                isCollapsed && 'lg:justify-center lg:px-0',
              )}
            >
              <NavIcon name={item.icon} />
              <span className={cn(isCollapsed && 'lg:hidden')}>{item.label}</span>
            </span>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              /* `end` on Dashboard only, so nested test routes keep Test Creation active. */
              end={item.to === PATH_DASHBOARD.root}
              /* The label is hidden when collapsed, so the icon needs a name. */
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 py-3 text-sm font-medium transition-colors',
                  'px-6',
                  isCollapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'bg-brand-50 text-brand-600 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-r before:bg-brand-600'
                    : 'text-ink-500 hover:bg-brand-50/60 hover:text-ink-700',
                )
              }
            >
              <NavIcon name={item.icon} />
              <span className={cn(isCollapsed && 'lg:hidden')}>{item.label}</span>
            </NavLink>
          ),
        )}
      </nav>
    </aside>
  )
}
