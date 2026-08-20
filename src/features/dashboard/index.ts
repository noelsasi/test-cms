/**
 * Public surface of the dashboard feature.
 * Other features import from '@/features/dashboard' only — never deeper.
 */
export { StatCard } from './StatCard'
export { DashboardCard } from './DashboardCard'
export { BreakdownBar, type BreakdownSegment } from './BreakdownBar'
export { CoveragePanel } from './CoveragePanel'
export { DifficultyStats } from './DifficultyStats'
export { DashboardSkeleton } from './DashboardSkeleton'
export { buildSubjectCoverage } from './coverage'
export { buildDashboardMetrics } from './dashboardMetrics'
