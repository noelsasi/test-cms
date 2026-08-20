/**
 * The backend wraps every response as { status, message, data }.
 * Note this differs from the task PDF, which documents `success: true`;
 * the live staging API uses `status: "success"`.
 */
export interface ApiEnvelope<T> {
  status: 'success' | 'error'
  message: string
  data: T
}

export interface User {
  id: string
  userId: string
  name: string
  role: string
  subrole: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Subject {
  id: string
  name: string
}

export interface Topic {
  id: string
  name: string
  subject_id: string
}

export interface SubTopic {
  id: string
  name: string
  topic_id: string
}

export type TestType = 'chapterwise' | 'pyq' | 'mock'
export type Difficulty = 'easy' | 'medium' | 'difficult'
/** `null` status behaves as an unsaved draft in the existing data set. */
export type TestStatus = 'draft' | 'live' | 'scheduled' | 'expired' | 'unpublished' | null

export interface Test {
  id: string
  name: string
  type: TestType
  /** Read back as display names, but written as UUIDs. */
  subject: string
  topics: string[] | null
  sub_topics: string[] | null
  questions: string[] | null
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: Difficulty
  total_marks: number
  total_time: number
  total_questions: number
  status: TestStatus
  created_at: string
  updated_at: string | null
  scheduled_date: string | null
  expiry_date: string | null
}

export interface TestPayload {
  name: string
  type: TestType
  subject: string
  topics: string[]
  sub_topics: string[]
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: Difficulty
  total_time: number
  total_marks: number
  total_questions: number
  status?: TestStatus
}

export type CorrectOption = 'option1' | 'option2' | 'option3' | 'option4'

export interface Question {
  id: string
  type: 'mcq'
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: CorrectOption
  explanation: string | null
  difficulty: Difficulty | null
  media_url: string | null
  test_id: string
  topic: string | null
  sub_topic: string | null
}

export type QuestionPayload = Omit<Question, 'id'>
