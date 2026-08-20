import type { Difficulty, Test, TestStatus } from '@/types'

/** Live tests expiring inside this window are called out as time-sensitive. */
export const EXPIRING_SOON_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000

export type EffectiveStatus = NonNullable<TestStatus>

/** A `null` status is an unsaved draft — the list screen treats it the same way. */
export function effectiveStatus(test: Test): EffectiveStatus {
  return test.status ?? 'draft'
}

export function questionCount(test: Test): number {
  return test.questions?.length ?? 0
}

/**
 * `hard` and `difficult` are the same level — the API returns one, the forms
 * write the other — so they're folded together before counting.
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export function normalizeDifficulty(difficulty: Difficulty): DifficultyLevel {
  return difficulty === 'difficult' ? 'hard' : difficulty
}

export interface DifficultyStat {
  level: DifficultyLevel
  /** Tests set to this level. */
  tests: number
  /** Questions authored inside those tests. */
  questions: number
  /** 0–1 of all tests, for the share label. */
  share: number
}

export interface StatusBreakdown {
  status: EffectiveStatus
  count: number
  /** 0–1, of all tests. Kept as a ratio so the view owns the formatting. */
  share: number
}

/** A test that can't ship yet: fewer questions saved than it asks for. */
export interface IncompleteTest {
  test: Test
  authored: number
  target: number
  /** 0–1. Pre-computed so the row renders without repeating the arithmetic. */
  progress: number
}

export interface DashboardMetrics {
  total: number
  live: number
  drafts: number
  totalQuestions: number
  /** Sum of every test's `total_questions` — the catalogue's authoring target. */
  targetQuestions: number
  /** 0–1 of `targetQuestions` actually authored. */
  completion: number
  /** Live tests lapsing within EXPIRING_SOON_DAYS. */
  expiringSoon: number
  statusBreakdown: StatusBreakdown[]
  /** Always easy → medium → hard, so the panel keeps a stable order. */
  difficultyStats: DifficultyStat[]
  /** Least-complete first — the author's work queue. */
  incomplete: IncompleteTest[]
  /** Newest first, by `created_at`. */
  recent: Test[]
}

const STATUS_ORDER: EffectiveStatus[] = ['live', 'scheduled', 'draft', 'unpublished', 'expired']
const DIFFICULTY_ORDER: DifficultyLevel[] = ['easy', 'medium', 'hard']

/**
 * Everything the dashboard shows is derived from the tests list the app already
 * fetches — no extra endpoints, and nothing displayed that the API doesn't
 * actually report.
 */
export function buildDashboardMetrics(tests: Test[], now: Date = new Date()): DashboardMetrics {
  const total = tests.length

  const statusCounts = new Map<EffectiveStatus, number>()
  let totalQuestions = 0
  let targetQuestions = 0
  let expiringSoon = 0
  const incomplete: IncompleteTest[] = []
  const difficultyTests = new Map<DifficultyLevel, number>()
  const difficultyQuestions = new Map<DifficultyLevel, number>()

  for (const test of tests) {
    const status = effectiveStatus(test)
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1)

    const authored = questionCount(test)
    const target = test.total_questions
    totalQuestions += authored
    targetQuestions += target

    const level = normalizeDifficulty(test.difficulty)
    difficultyTests.set(level, (difficultyTests.get(level) ?? 0) + 1)
    difficultyQuestions.set(level, (difficultyQuestions.get(level) ?? 0) + authored)

    const expiresAt = test.expiry_date ? new Date(test.expiry_date).getTime() : null
    if (
      status === 'live' &&
      expiresAt !== null &&
      expiresAt > now.getTime() &&
      expiresAt - now.getTime() <= EXPIRING_SOON_DAYS * DAY_MS
    ) {
      expiringSoon += 1
    }

    // Expired tests are history — leaving them in would clog the work queue.
    if (status !== 'expired' && target > 0 && authored < target) {
      incomplete.push({ test, authored, target, progress: authored / target })
    }
  }

  incomplete.sort((a, b) => a.progress - b.progress)

  const statusBreakdown = STATUS_ORDER.map((status) => {
    const count = statusCounts.get(status) ?? 0
    return { status, count, share: total === 0 ? 0 : count / total }
  }).filter((entry) => entry.count > 0)

  // Every level is kept, including zeroes — an empty tier is itself the
  // signal that the bank is unbalanced.
  const difficultyStats = DIFFICULTY_ORDER.map((level) => {
    const count = difficultyTests.get(level) ?? 0
    return {
      level,
      tests: count,
      questions: difficultyQuestions.get(level) ?? 0,
      share: total === 0 ? 0 : count / total,
    }
  })

  const recent = [...tests]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return {
    total,
    live: statusCounts.get('live') ?? 0,
    drafts: statusCounts.get('draft') ?? 0,
    totalQuestions,
    targetQuestions,
    completion: targetQuestions === 0 ? 0 : totalQuestions / targetQuestions,
    expiringSoon,
    statusBreakdown,
    difficultyStats,
    incomplete,
    recent,
  }
}
