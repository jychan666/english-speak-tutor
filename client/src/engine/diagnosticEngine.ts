import type { DiagnosticReport } from '@/types/scoring'
import {
  recommendArticlesByDimensions,
  recommendPracticeByPart,
  topArticleForDimension,
  type DiagnosticDimension,
} from './recommendationEngine'

export interface DiagnosticHint {
  dimension: DiagnosticDimension
  detail: string
  suggestion: string
}

interface DiagnosticInput {
  part: 'A' | 'B' | 'C'
  score: number
  hints: DiagnosticHint[]
}

function toLevel(score: number): DiagnosticReport['overallLevel'] {
  if (score >= 85) return 'excellent'
  if (score >= 72) return 'good'
  if (score >= 60) return 'fair'
  return 'needs-work'
}

export function generateDiagnosticReport(input: DiagnosticInput): DiagnosticReport {
  const strengths: string[] = []
  const weaknesses: string[] = []

  if (input.score >= 80) {
    strengths.push('本次输出较稳定，核心信息表达清楚。')
  }

  const seenDimensions = new Set<DiagnosticDimension>()
  for (const hint of input.hints) {
    if (!seenDimensions.has(hint.dimension)) {
      weaknesses.push(hint.detail)
      seenDimensions.add(hint.dimension)
    }
  }

  const specificErrors = input.hints.map((hint) => ({
    type: hint.dimension,
    detail: hint.detail,
    suggestion: hint.suggestion,
    relatedArticleId: topArticleForDimension(hint.dimension),
  }))

  const recommendedArticles = recommendArticlesByDimensions(
    Array.from(seenDimensions),
    4
  )
  const recommendedPractice = recommendPracticeByPart(input.part)

  return {
    overallLevel: toLevel(input.score),
    strengths,
    weaknesses,
    specificErrors,
    recommendedArticles,
    recommendedPractice,
  }
}

