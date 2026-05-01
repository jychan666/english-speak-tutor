export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface ContentListResponse {
  partA: import('./exam').PartAPassage[]
  partB: import('./exam').PartBScenario[]
  partC: import('./exam').PartCStory[]
  mockExams: import('./exam').MockExam[]
}

export interface ProgressSummary {
  totalAttempts: number
  avgScore: number
  partAScores: number[]
  partBScores: number[]
  partCScores: number[]
  recentAttempts: import('./scoring').ExamAttempt[]
}
