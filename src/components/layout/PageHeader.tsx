import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

interface PageHeaderProps {
  crumbs?: Crumb[]
  title?: string
  /** Right-aligned slot for the primary action, e.g. "Create New Test". */
  actions?: ReactNode
}

export function PageHeader({ crumbs, title, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
        {title && <h1 className="text-xl font-semibold text-ink-900">{title}</h1>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
