/**
 * Barrel for shared UI primitives. Grouped by role — consumers import from
 * '@/components/ui' only, so the internal grouping stays free to change.
 */

/* Primitives — generic building blocks with no domain knowledge. */
export { Button } from './primitives/Button'
export { Logo } from './primitives/Logo'
export { TrashIcon } from './primitives/TrashIcon'
export { Spinner } from './primitives/Spinner'

/* Forms — input controls bound by react-hook-form. */
export { Input } from './forms/Input'
export { Select } from './forms/Select'
export { MultiSelect } from './forms/MultiSelect'
export { RadioGroup } from './forms/RadioGroup'
export { NumberStepper } from './forms/NumberStepper'
export { RichTextEditor } from './forms/RichTextEditor'

/* Feedback — status, loading and transient UI. */
export { Alert } from './feedback/Alert'
export { EmptyState } from './feedback/EmptyState'
export { ConfirmDialog } from './feedback/ConfirmDialog'
export { Skeleton, SkeletonRegion } from './feedback/Skeleton'
export { PageLoader } from './feedback/PageLoader'
export { ToastProvider } from './feedback/ToastProvider'
export { type ToastVariant } from './feedback/toastContext'
export { useToast } from './feedback/useToast'

/* Data — tabular and navigational display. */
export { Table, type Column, type TablePaginationConfig } from './data/Table'
export { Tabs } from './data/Tabs'
