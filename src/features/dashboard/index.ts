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
export { buildSubjectCoverage, type SubjectCoverage, type TopicCoverage } from './coverage'
export {
  buildDashboardMetrics,
  effectiveStatus,
  questionCount,
  normalizeDifficulty,
  type DashboardMetrics,
  type DifficultyLevel,
  type DifficultyStat,
} from './dashboardMetrics'
