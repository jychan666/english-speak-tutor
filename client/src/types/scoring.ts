export interface RecognizedWord {
  word: string
  confidence: number
  startTime: number
  endTime: number
}

export interface PronunciationScore {
  accuracy: number
  fluency: number
  intonation: number
  overall: number
  details: {
    wordsTotal: number
    wordsCorrect: number
    wordsPerMinute: number
    pauseCount: number
    avgConfidence: number
    mismatchedWords: Array<{ expected: string; recognized: string }>
    errorPhonemes: string[]
  }
}

export interface RolePlayScore {
  questionGrammar: number
  questionRelevance: number
  answerAccuracy: number
  answerFluency: number
  overall: number
  details: {
    questions: Array<{
      prompt: string
      recognized: string
      grammarIssues: string[]
      keywordMatch: number
    }>
    answers: Array<{
      question: string
      recognized: string
      keywordMatch: number
    }>
  }
}

export interface StoryRetellScore {
  contentCoverage: number
  coherence: number
  languageUse: number
  fluency: number
  overall: number
  details: {
    keyPointsTotal: number
    keyPointsCovered: number
    coveredPoints: string[]
    missedPoints: string[]
    wordsPerMinute: number
  }
}

export type PartScore = PronunciationScore | RolePlayScore | StoryRetellScore

export interface DiagnosticReport {
  overallLevel: 'excellent' | 'good' | 'fair' | 'needs-work'
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

export interface PartResult {
  part: 'A' | 'B' | 'C'
  score: PartScore
  transcript: string
  diagnosticReport: DiagnosticReport
  duration: number
}

export interface ExamAttempt {
  id: string
  date: string
  mode: 'practice' | 'mock'
  partResults: PartResult[]
  totalScore: number
  totalDuration: number
}
