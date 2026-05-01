export interface StoredAttempt {
  id: string
  date: string
  mode: 'practice' | 'mock'
  totalScore: number
  totalDuration: number
  partResults: Array<{
    part: 'A' | 'B' | 'C'
    score: Record<string, unknown> & { overall: number }
    transcript: string
    duration: number
    diagnosticReport: {
      overallLevel: string
      strengths: string[]
      weaknesses: string[]
      specificErrors: Array<{
        type: string
        detail: string
        suggestion: string
        relatedArticleId?: string
      }>
      recommendedArticles: string[]
      recommendedPractice: string[]
    }
  }>
}

